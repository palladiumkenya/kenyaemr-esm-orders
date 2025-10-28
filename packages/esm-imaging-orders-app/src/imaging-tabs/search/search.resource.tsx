import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';

import { type ImagingConfig } from '../../config-schema';
import { type Result } from '../work-list/work-list.resource';

export const imagingResultsResponseFormat =
  'custom:(' +
  'uuid,orderNumber,' +
  'patient:(uuid,display,identifiers,person:(uuid,display,age,gender)),' +
  'concept:(uuid,display,conceptClass),' +
  'action,careSetting,orderer:ref,urgency,instructions,' +
  'orderReasonNonCoded,orderReason,bodySite,laterality,' +
  'commentToFulfiller,procedures,display,fulfillerStatus,' +
  'dateStopped,scheduledDate,dateActivated,fulfillerComment' +
  ')';

export const usePatientOrders = (patientUuid: string) => {
  const {
    orders: { radiologyOrderTypeUuid },
    radiologyConceptClassUuid,
  } = useConfig<ImagingConfig>();
  const baseUrl = `${restBaseUrl}/order?patient=${patientUuid}&orderTypes=${radiologyOrderTypeUuid}&v=${imagingResultsResponseFormat}`;
  const { data, isLoading, error } = useSWR<{ data: { results: Array<Result> } }>(
    patientUuid ? baseUrl : null,
    openmrsFetch,
  );
  const filteredOrders = data?.data?.results?.filter(
    (order) => order.concept.conceptClass.uuid === radiologyConceptClassUuid,
  );
  return { orders: filteredOrders ?? [], isLoading, error };
};
