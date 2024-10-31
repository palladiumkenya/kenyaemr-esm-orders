import useSWR from 'swr';
import { fhirBaseUrl, openmrsFetch, parseDate } from '@openmrs/esm-framework';
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

export function usePrescriptionDetails(encounterUuid: string, refreshInterval = null) {
  const medicationRequestBundles: Array<MedicationRequestBundle> = [];
  let prescriptionDate: Date;
  let isLoading = true;

  const { data, error } = useSWR<{ data: MedicationRequestResponse }, Error>(
    getPrescriptionDetailsEndpoint(encounterUuid),
    openmrsFetch,
    { refreshInterval: refreshInterval },
  );

  if (data) {
    const results = data?.data.entry;

    const encounter = results
      ?.filter((entry) => entry?.resource?.resourceType == 'Encounter')
      .map((entry) => entry.resource as unknown as Encounter);

    if (encounter) {
      // by definition of the request (search by encounter) there should be one and only one encounter
      prescriptionDate = parseDate(encounter[0]?.period.start);

      const medicationRequests = results
        ?.filter((entry) => entry?.resource?.resourceType == 'MedicationRequest')
        .map((entry) => entry.resource as MedicationRequest);

      const medicationDispenses = results
        ?.filter((entry) => entry?.resource?.resourceType == 'MedicationDispense')
        .map((entry) => entry.resource as MedicationDispense)
        .sort(sortMedicationDispensesByWhenHandedOver);

      medicationRequests.every((medicationRequest) =>
        medicationRequestBundles.push({
          request: medicationRequest,
          dispenses: getAssociatedMedicationDispenses(medicationRequest, medicationDispenses).sort(
            sortMedicationDispensesByWhenHandedOver,
          ),
        }),
      );
    }
  }

  isLoading = (!medicationRequestBundles || medicationRequestBundles.length == 0) && !error;

  return {
    medicationRequestBundles,
    prescriptionDate,
    isError: error,
    isLoading,
  };
}

export function usePatientAllergies(patientUuid: string, refreshInterval) {
  const { data, error } = useSWR<{ data: AllergyIntoleranceResponse }, Error>(
    `${fhirBaseUrl}/AllergyIntolerance?patient=${patientUuid}`,
    openmrsFetch,
    { refreshInterval: refreshInterval },
  );

  const allergies = [];
  if (data) {
    const entries = data?.data.entry;
    entries?.map((allergy) => {
      return allergies.push(allergy.resource);
    });
  }

  return {
    allergies,
    totalAllergies: data?.data.total,
    isError: error,
  };
}

// supports passing just the uuid/code or the entire reference, ie either: "MedicationReference/123-abc" or "123-abc"
export function useMedicationRequest(reference: string, refreshInterval) {
  reference = reference
    ? reference.startsWith('MedicationRequest')
      ? reference
      : `MedicationRequest/${reference}`
    : null;

  const { data } = useSWR<{ data: MedicationRequest }, Error>(
    reference ? `${fhirBaseUrl}/${reference}` : null,
    openmrsFetch,
    { refreshInterval: refreshInterval },
  );
  return {
    medicationRequest: data ? data.data : null,
  };
}

export function updateMedicationRequestFulfillerStatus(
  medicationRequestUuid: string,
  fulfillerStatus: MedicationRequestFulfillerStatus,
) {
  const url = `${fhirBaseUrl}/MedicationRequest/${medicationRequestUuid}`;

  return openmrsFetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': JSON_MERGE_PATH_MIME_TYPE,
    },
    body: {
      extension: [
        {
          url: OPENMRS_FHIR_EXT_REQUEST_FULFILLER_STATUS,
          valueCode: fulfillerStatus,
        },
      ],
    },
  });
}
