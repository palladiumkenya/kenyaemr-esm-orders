import { openmrsFetch, restBaseUrl, type Visit } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';

export function useVisit(patientUuid: string) {
  const customRepresentation =
    'custom:(uuid,patient,encounters:(uuid,diagnoses:(uuid,display,certainty,diagnosis:(coded:(uuid,display))),encounterDatetime,encounterType:(uuid,display),encounterProviders:(uuid,display,provider:(uuid,person:(uuid,display)))),location:(uuid,name,display),visitType:(uuid,name,display),startDatetime,stopDatetime)&limit=1';

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<Visit> } }, Error>(
    `${restBaseUrl}/visit?patient=${patientUuid}&v=${customRepresentation}`,
    openmrsFetch,
  );

  return {
    visits: data ? data?.data?.results[0] : null,
    error,
    isLoading,
    isValidating,
    mutateVisits: mutate,
  };
}

const usePatientDiagnosis = (patientUUid: string) => {
  const { visits: recentVisit, error, isLoading } = useVisit(patientUUid);

  const diagnoses = useMemo(() => {
    return (
      recentVisit?.encounters?.flatMap(
        (encounter) =>
          encounter.diagnoses.map((diagnosis) => ({
            id: diagnosis.diagnosis.coded.uuid,
            text: diagnosis.display,
          })) || [],
      ) || []
    );
  }, [recentVisit]);

  return { error, isLoading, diagnoses: diagnoses as Array<{ id: string; text: string }> };
};

export default usePatientDiagnosis;
