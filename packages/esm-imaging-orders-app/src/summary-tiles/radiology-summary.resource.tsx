import useSWR, { mutate } from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';

import { Result } from '../imaging-tabs/work-list/work-list.resource';
import { useCallback, useMemo } from 'react';
import { RadiologyConfig } from '../config-schema';

/**
 * Hook to fetch and process imaging order statistics based on fulfiller status.
 *
 * @param fulfillerStatus - The status of the order to filter by.
 * @returns An object containing the count of orders, loading state, error state, and a mutate function.
 */
export function useImagingOrderStats(fulfillerStatus: string) {
  const {
    orders: { radiologyOrderTypeUuid },
    radiologyConceptClassUuid,
  } = useConfig<RadiologyConfig>();

  const responseFormat =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)';
  const apiUrl = useMemo(() => {
    const orderTypeParam = `orderTypes=${radiologyOrderTypeUuid}&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
    return `/ws/rest/v1/order?${orderTypeParam}`;
  }, [radiologyOrderTypeUuid, fulfillerStatus, responseFormat]);

  const mutateOrders = useCallback(() => {
    return mutate(
      (key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderType=${radiologyOrderTypeUuid}`),
    );
  }, [radiologyOrderTypeUuid]);

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  const radiologyOrders = useMemo(() => {
    return data?.data?.results?.filter((order) => {
      const baseConditions =
        order.dateStopped === null && order.concept.conceptClass.uuid === radiologyConceptClassUuid;

      switch (fulfillerStatus) {
        case '':
          return baseConditions && order.fulfillerStatus === null && order.action === 'NEW';
        case 'IN_PROGRESS':
        case 'DECLINED':
        case 'COMPLETED':
        case 'EXCEPTION':
          return baseConditions && order.fulfillerStatus === fulfillerStatus && order.action !== 'DISCONTINUE';
        default:
          return false;
      }
    });
  }, [data, fulfillerStatus, radiologyConceptClassUuid]);

  const count = useMemo(
    () => (fulfillerStatus != null ? radiologyOrders?.length ?? 0 : 0),
    [fulfillerStatus, radiologyOrders],
  );

  return {
    count,
    isLoading,
    isError: error,
    mutate: mutateOrders,
  };
}
