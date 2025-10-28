import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type FulfillerStatus } from '@openmrs/esm-patient-common-lib';

import { type Result } from '../imaging-tabs/work-list/work-list.resource';
import { type ImagingConfig } from '../config-schema';

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

export const usePatientImagingResults = (patientUuid: string) => {
  const fulfillerStatus: FulfillerStatus = 'COMPLETED';
  const {
    orders: { radiologyOrderTypeUuid },
  } = useConfig<ImagingConfig>();
  const baseUrl = `${restBaseUrl}/order?patient=${patientUuid}&orderTypes=${radiologyOrderTypeUuid}&v=${imagingResultsResponseFormat}&&fulfillerStatus=${fulfillerStatus}`;
  const { data, isLoading, error } = useSWR<{ data: { results: Array<Result> } }>(baseUrl, openmrsFetch);
  return { orders: data?.data?.results ?? [], isLoading, error };
};
