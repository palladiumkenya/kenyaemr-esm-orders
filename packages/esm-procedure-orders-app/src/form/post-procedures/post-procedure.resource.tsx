import useSWR from 'swr';
import { type OpenmrsResource, openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type CodedProvider, type CodedCondition, ProcedurePayload } from '../../types';
import { updateOrder } from '../../procedures-ordered/pick-procedure-order/add-to-worklist-dialog.resource';

type Provider = {
  uuid: string;
  display: string;
  person: OpenmrsResource;
};

export const useProviders = () => {
  const url = `${restBaseUrl}/provider?v=custom:(uuid,display,person:(uuid,display))`;
  const { data, error, isLoading } = useSWR<{
    data: { results: Array<Provider> };
  }>(url, openmrsFetch);

  return {
    providers: data?.data.results ?? [],
    isLoadingProviders: isLoading,
    loadingProvidersError: error,
  };
};

export async function savePostProcedure(reportPayload) {
  const abortController = new AbortController();
  const updateResults = await openmrsFetch(`/ws/rest/v1/procedure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: reportPayload,
  });

  if (updateResults.status === 201 || updateResults.status === 200) {
    return await updateOrder(reportPayload.procedureOrder, {
      fulfillerStatus: 'COMPLETED',
    });
  }
}

export function useConditionsSearch(conditionToLookup: string) {
  const config = useConfig();
  const conditionConceptClassUuid = config?.conditionConceptClassUuid;
  const conditionsSearchUrl = `${restBaseUrl}/conceptsearch?conceptClasses=${conditionConceptClassUuid}&q=${conditionToLookup}`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<CodedCondition> } }, Error>(
    conditionToLookup ? conditionsSearchUrl : null,
    openmrsFetch,
  );

  return {
    searchResults: data?.data?.results ?? [],
    error: error,
    isSearching: isLoading,
  };
}

export function useProvidersSearch(providerToLookup: string) {
  const providerSearchUrl = `${restBaseUrl}/provider?v=custom:(uuid,display,person:(uuid,display))&q=${providerToLookup}`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<CodedProvider> } }, Error>(
    providerToLookup ? providerSearchUrl : null,
    openmrsFetch,
  );

  return {
    providerSearchResults: data?.data?.results ?? [],
    error: error,
    isProviderSearching: isLoading,
  };
}
