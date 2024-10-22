import { useMemo } from 'react';
import fuzzy from 'fuzzy';
import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type MedicalSupply } from '../../../types';

export function useMedicalSupplySearch(searchTerm: string, medicalSupplyConceptClass: string) {
  const medicalSupplySearchUrl = `${restBaseUrl}/conceptsearch?conceptClasses=${medicalSupplyConceptClass}&q=${searchTerm}`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<MedicalSupply> } }, Error>(
    medicalSupplySearchUrl,
    openmrsFetch,
  );
  const medicalSupplyConcepts = useMemo(() => {
    return data?.data?.results?.map((concept) => ({
      label: concept.display,
      conceptUuid: concept.concept.uuid,
    }));
  }, [data]);

  const filteredMedicalSupplyTypes = useMemo(() => {
    return searchTerm && !isLoading && !error
      ? fuzzy.filter(searchTerm, medicalSupplyConcepts, { extract: (c) => c.label }).map((result) => result.original)
      : medicalSupplyConcepts;
  }, [medicalSupplyConcepts, searchTerm, error, isLoading]);

  return {
    searchResults: filteredMedicalSupplyTypes,
    isLoading: isLoading,
    error: error,
  };
}
