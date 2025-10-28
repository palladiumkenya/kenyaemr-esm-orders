import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type FulfillerStatus } from '@openmrs/esm-patient-common-lib';

import { type Result } from '../types';
import { type ConfigObject } from '../config-schema';

export const procedureResultsResponseFormat =
  'custom:(' +
  'uuid,orderNumber,' +
  'patient:(uuid,display,identifiers,person:(uuid,display,age,gender)),' +
  'concept:(uuid,display,conceptClass),' +
  'action,careSetting,orderer:ref,urgency,instructions,' +
  'orderReasonNonCoded,orderReason,bodySite,laterality,commentToFulfiller,' +
  'procedures:(' +
  'uuid,patient,procedureOrder,concept,procedureReason,category,bodySite,partOf,' +
  'startDatetime,endDatetime,status,statusReason,outcome,procedureReport,impressions,' +
  'location,encounters:(obs:(uuid,value))' +
  '),' +
  'display,fulfillerStatus,dateStopped,scheduledDate,dateActivated,fulfillerComment' +
  ')';

export const usePatientProcedureResults = (patientUuid: string) => {
  const fulfillerStatus: FulfillerStatus = 'COMPLETED';
  const { procedureOrderTypeUuid, procedureConceptClassUuid } = useConfig<ConfigObject>();
  const baseUrl = `${restBaseUrl}/order?patient=${patientUuid}&orderTypes=${procedureOrderTypeUuid}&v=${procedureResultsResponseFormat}&&fulfillerStatus=${fulfillerStatus}`;
  const { data, isLoading, error } = useSWR<{ data: { results: Array<Result> } }>(baseUrl, openmrsFetch);

  const orders = data?.data?.results ?? [];
  const filteredOrders = orders.filter((order) => order.concept.conceptClass.uuid === procedureConceptClassUuid);

  return { orders: filteredOrders, isLoading, error };
};
