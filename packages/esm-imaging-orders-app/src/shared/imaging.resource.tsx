import useSWR, { mutate } from 'swr';
import { openmrsFetch, useAppContext, useConfig } from '@openmrs/esm-framework';

import { type Result } from '../imaging-tabs/work-list/work-list.resource';
import { useCallback, useMemo } from 'react';
import { type ImagingConfig } from '../config-schema';
import { type DateFilterContext } from '../types';
import dayjs from 'dayjs';

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
  } = useConfig<ImagingConfig>();

  const dateRange = useAppContext<DateFilterContext>('imaging-date-filter')?.dateRange;

  // Calculate date range boundaries
  const dateRangeDates = useMemo(() => {
    const startDate = dateRange?.at(0);
    const endDate = dateRange?.at(1);
    
    return {
      activatedOnOrAfterDate: startDate ? dayjs(startDate).startOf('day').toISOString() : undefined,
      activatedOnOrBeforeDate: endDate ? dayjs(endDate).endOf('day').toISOString() : undefined,
    };
  }, [dateRange]);

  const responseFormat =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)';

  // Build API URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      orderTypes: radiologyOrderTypeUuid,
      fulfillerStatus,
      v: responseFormat,
    });

    if (dateRangeDates.activatedOnOrAfterDate) {
      params.set('activatedOnOrAfterDate', dateRangeDates.activatedOnOrAfterDate);
    }
    if (dateRangeDates.activatedOnOrBeforeDate) {
      params.set('activatedOnOrBeforeDate', dateRangeDates.activatedOnOrBeforeDate);
    }

    return `/ws/rest/v1/order?${params.toString()}`;
  }, [
    radiologyOrderTypeUuid,
    fulfillerStatus,
    responseFormat,
    dateRangeDates.activatedOnOrAfterDate,
    dateRangeDates.activatedOnOrBeforeDate,
  ]);

  // Fetch orders from API
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  // Filter orders based on fulfiller status and other conditions
  const radiologyOrders = useMemo(() => {
    if (!data?.data?.results) return [];

    return data.data.results.filter((order) => {
      const isOrderNotStopped = order.dateStopped === null;
      const isRadiologyOrder = order.concept.conceptClass.uuid === radiologyConceptClassUuid;
      
      if (!isOrderNotStopped || !isRadiologyOrder) {
        return false;
      }

      return matchesFulfillerStatus(order, fulfillerStatus);
    });
  }, [data, fulfillerStatus, radiologyConceptClassUuid]);

  // Calculate order count
  const count = useMemo(() => radiologyOrders?.length ?? 0, [radiologyOrders]);

  // Mutate cache for this query pattern
  const mutateOrders = useCallback(() => {
    return mutate(
      (key) => typeof key === 'string' && key.includes('/order?') && key.includes(`orderTypes=${radiologyOrderTypeUuid}`),
    );
  }, [radiologyOrderTypeUuid]);

  return {
    count,
    isLoading,
    isError: error,
    mutate: mutateOrders,
  };
}

/**
 * Determines if an order matches the specified fulfiller status filter
 */
function matchesFulfillerStatus(order: Result, fulfillerStatus: string): boolean {
  const isNewOrder = fulfillerStatus === '' && order.action === 'NEW';
  const isActiveOrderStatus = ['IN_PROGRESS', 'DECLINED', 'COMPLETED', 'EXCEPTION'].includes(fulfillerStatus);
  const isNotDiscontinued = order.action !== 'DISCONTINUE';

  if (isNewOrder) {
    return order.fulfillerStatus === null;
  }

  if (isActiveOrderStatus) {
    return order.fulfillerStatus === fulfillerStatus && isNotDiscontinued;
  }

  return false;
}
