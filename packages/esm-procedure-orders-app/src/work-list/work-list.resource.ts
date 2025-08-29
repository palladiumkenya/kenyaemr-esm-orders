import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { type ConfigObject } from '../config-schema';
import { type Result } from '../types';

export function useGetOrdersWorklist(activatedOnOrAfterDate: string, fulfillerStatus: string) {
  const config = useConfig() as ConfigObject;

  const apiUrl = `/ws/rest/v1/order?orderTypes=${config.testOrderTypeUuid}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=full`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  const orders = data?.data?.results?.filter((order) => {
    if (fulfillerStatus === '') {
      return order.fulfillerStatus === null && order.dateStopped === null && order.action === 'NEW';
    } else if (fulfillerStatus === 'IN_PROGRESS') {
      return order.fulfillerStatus === 'IN_PROGRESS' && order.dateStopped === null && order.action !== 'DISCONTINUE';
    }
  });

  return {
    workListEntries: orders?.length > 0 ? orders : [],
    isLoading,
    isError: error,
  };
}
