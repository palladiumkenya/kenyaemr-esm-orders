import { useEffect, useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import fuzzy from 'fuzzy';
import { type FetchResponse, openmrsFetch, useConfig, restBaseUrl, reportError } from '@openmrs/esm-framework';

import { type MedicalSupplyConfig } from '../config-schema';
import { type Concept } from '../types';
import useSWR from 'swr';

type ConceptResult = FetchResponse<Concept>;
type ConceptResults = FetchResponse<{ setMembers: Array<Concept> }>;

export interface MedicalSupplyType {
  label: string;
  conceptUuid: string;
}

export interface UseMedicalSupplyType {
  medicalSupplyTypes: Array<MedicalSupplyType>;
  isLoading: boolean;
  error: Error;
}

export function useQuantityUnits() {
  const config = useConfig<MedicalSupplyConfig>();
  const apiUrl = `${restBaseUrl}/concept/${config.medicalSupplyQuantityUnitsConceptSetUuid}?v=custom:setMembers`;
  const { data, error, isLoading } = useSWR<{ data: Concept }, Error>(apiUrl, openmrsFetch);
  return {
    quantityUnits: data?.data?.setMembers ? data?.data?.setMembers : [],
    isLoading,
    isError: error,
  };
}
