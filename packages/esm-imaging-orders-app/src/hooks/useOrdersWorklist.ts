import { openmrsFetch, restBaseUrl, useAppContext, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { useMemo, useCallback } from 'react';
import { Result } from '../imaging-tabs/work-list/work-list.resource';
import { ImagingConfig } from '../config-schema';
import { FulfillerStatus } from '../shared/ui/common/grouped-imaging-types';
import dayjs from 'dayjs';
import { DateFilterContext } from '../types';

const createApiUrl = (
  OrderTypeUuid: string,
  activatedOnOrAfterDate: string,
  activatedOnOrBeforeDate: string,
  fulfillerStatus: string,
) => {
  const responseFormat =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,orderReasonNonCoded,bodySite,laterality,commentToFulfiller,procedures,display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment)';
  const orderTypeParam = `orderTypes=${OrderTypeUuid}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&activatedOnOrBeforeDate=${activatedOnOrBeforeDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;

  return `${restBaseUrl}/order?${orderTypeParam}`;
};

export function useOrdersWorkList(activatedOnOrAfterDate: string, fulfillerStatus: FulfillerStatus) {
  const {
    orders: { radiologyOrderTypeUuid },
    radiologyConceptClassUuid,
  } = useConfig<ImagingConfig>();

  const { dateRange } = useAppContext<DateFilterContext>('imaging-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
  };

  const apiUrl = useMemo(
    () =>
      createApiUrl(
        radiologyOrderTypeUuid,
        dateRange.at(0).toISOString(),
        dateRange.at(1).toISOString(),
        fulfillerStatus,
      ),
    [radiologyOrderTypeUuid, dateRange.at(0).toISOString(), dateRange.at(1).toISOString(), fulfillerStatus],
  );

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Array<Result> } }>(apiUrl, openmrsFetch);

  const filterOrders = useCallback(
    (order: Result) => {
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
    },
    [radiologyConceptClassUuid, fulfillerStatus],
  );

  const sortedOrders = useMemo(() => {
    const filteredOrders = data?.data?.results?.filter(filterOrders) || [];
    return filteredOrders.sort((a, b) => new Date(a.dateActivated).getTime() - new Date(b.dateActivated).getTime());
  }, [data, filterOrders]);

  return {
    workListEntries: sortedOrders,
    isLoading,
    isError: error,
    mutate,
  };
}
