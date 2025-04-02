import { type ConfigObject, openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { medicalSupplyOrderConceptClass_UUID } from '../constants';
import { type Result } from '../types';
export function useAllOrders(activatedOnOrAfterDate: string, fulfillerStatus: string) {
  const config = useConfig() as ConfigObject;

  const responseFormat =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass:(uuid)),action,careSetting,orderer:ref,encounter,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment,frequency,numberOfRepeats,quantity,quantityUnits:(uuid,display))';
  const responseFormat1 =
    'custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass:(uuid)),action,careSetting,orderer:ref,procedures,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment,frequency,numberOfRepeats)';
  const orderTypeParam = `orderTypes=${config.orders.medicalSupplyOrderTypeUuid}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(apiUrl, openmrsFetch);

  const orders = data?.data?.results?.filter((order) => {
    return order.concept.conceptClass.uuid === medicalSupplyOrderConceptClass_UUID;
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
