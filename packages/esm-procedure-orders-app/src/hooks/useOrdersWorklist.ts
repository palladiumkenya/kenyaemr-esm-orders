import { type ConfigObject, openmrsFetch, useAppContext, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { ProcedureConceptClass_UUID } from '../constants';
import { type DateFilterContext, type Result } from '../types';
import dayjs from 'dayjs';
export function useOrdersWorklist(activatedOnOrAfterDate: string, fulfillerStatus: string) {
  const config = useConfig() as ConfigObject;
  const { dateRange } = useAppContext<DateFilterContext>('procedures-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
  };

  const responseFormat =
    'custom:(uuid,orderNumber,patient:(uuid,display,identifiers,person:(uuid,display,age,gender)),concept:(uuid,display,conceptClass),action,careSetting,orderer:(uuid,display),urgency,instructions,bodySite,laterality,commentToFulfiller,procedures,display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment)';
  const orderTypeParam = `orderTypes=${config.procedureOrderTypeUuid}&activatedOnOrAfterDate=${dateRange
    .at(0)
    .toISOString()}&activatedOnOrBeforeDate=${dateRange
    .at(1)
    .toISOString()}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  const orders = data?.data?.results?.filter((order) => {
    if (fulfillerStatus === '') {
      return (
        order.fulfillerStatus === null &&
        order.dateStopped === null &&
        order.action === 'NEW' &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === 'IN_PROGRESS') {
      return (
        order.fulfillerStatus === 'IN_PROGRESS' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === 'COMPLETED') {
      return (
        order.fulfillerStatus === 'COMPLETED' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === 'EXCEPTION') {
      return (
        order.fulfillerStatus === 'EXCEPTION' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === 'DECLINED') {
      return (
        order.fulfillerStatus === 'DECLINED' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    }
  });
  const sortedOrders = orders?.sort(
    (a, b) => new Date(a.dateActivated).getTime() - new Date(b.dateActivated).getTime(),
  );

  return {
    workListEntries: sortedOrders?.length > 0 ? sortedOrders : [],
    isLoading,
    isError: error,
  };
}
