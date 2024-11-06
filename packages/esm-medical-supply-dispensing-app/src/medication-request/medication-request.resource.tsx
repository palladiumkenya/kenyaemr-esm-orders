import useSWR from 'swr';
import { fhirBaseUrl, openmrsFetch, parseDate, restBaseUrl } from '@openmrs/esm-framework';
import {
  type AllergyIntoleranceResponse,
  type EncounterResponse,
  type MedicationRequest,
  type MedicationRequestResponse,
  type PrescriptionsTableRow,
  type MedicationDispense,
  type Encounter,
  type MedicationRequestFulfillerStatus,
  type MedicationRequestBundle,
} from '../types/index';
import {
  getPrescriptionDetailsEndpoint,
  getMedicationDisplay,
  getMedicationReferenceOrCodeableConcept,
  getPrescriptionTableActiveMedicationRequestsEndpoint,
  getPrescriptionTableAllMedicationRequestsEndpoint,
  sortMedicationDispensesByWhenHandedOver,
  computePrescriptionStatusMessageCode,
  getAssociatedMedicationDispenses,
} from '../utils';
import dayjs from 'dayjs';
import { JSON_MERGE_PATH_MIME_TYPE, OPENMRS_FHIR_EXT_REQUEST_FULFILLER_STATUS } from '../constants';

// update Order
export async function updateSupplyOrderFulfillerStatus(uuid: string, body: any) {
  const abortController = new AbortController();
  return openmrsFetch(`${restBaseUrl}/order/${uuid}/fulfillerdetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: body,
  });
}
