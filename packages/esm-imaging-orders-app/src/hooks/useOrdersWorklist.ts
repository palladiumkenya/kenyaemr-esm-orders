import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { Result } from '../imaging-tabs/work-list/work-list.resource';
import { RadiologyConfig } from '../config-schema';

export function useOrdersWorklist(activatedOnOrAfterDate: string, fulfillerStatus: string) {
  const {
    orders: { radiologyOrderTypeUuid },
    radiologyConceptClassUuid,
  } = useConfig<RadiologyConfig>();
  const responseFormat =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,bodySite,laterality,commentToFulfiller,procedures,display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment)';
  const orderTypeParam = `orderTypes=${radiologyOrderTypeUuid}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  const orders = data?.data?.results?.filter((order) => {
    if (fulfillerStatus === '') {
      return (
        order.fulfillerStatus === null &&
        order.dateStopped === null &&
        order.action === 'NEW' &&
        order.concept.conceptClass.uuid === radiologyConceptClassUuid
      );
    } else if (fulfillerStatus === 'IN_PROGRESS') {
      return (
        order.fulfillerStatus === 'IN_PROGRESS' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === radiologyConceptClassUuid
      );
    } else if (fulfillerStatus === 'DECLINED') {
      return (
        order.fulfillerStatus === 'DECLINED' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === radiologyConceptClassUuid
      );
    } else if (fulfillerStatus === 'COMPLETED') {
      return (
        order.fulfillerStatus === 'COMPLETED' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === radiologyConceptClassUuid
      );
    } else if (fulfillerStatus === 'EXCEPTION') {
      return (
        order.fulfillerStatus === 'EXCEPTION' &&
        order.dateStopped === null &&
        order.action !== 'DISCONTINUE' &&
        order.concept.conceptClass.uuid === radiologyConceptClassUuid
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
    mutate,
  };
}
