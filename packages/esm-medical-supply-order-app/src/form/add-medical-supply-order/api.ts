import useSWR from 'swr';
import { type FetchResponse, openmrsFetch, restBaseUrl, showSnackbar } from '@openmrs/esm-framework';
import type { OrderPost } from '@openmrs/esm-patient-common-lib';
import useSWRImmutable from 'swr/immutable';
import { type MedicalSupplyOrderBasketItem } from '../../types';

export const careSettingUuid = '6f0c9a92-6f24-11e3-af88-005056821db0';

export function useOrderReasons(conceptUuids: Array<string>) {
  const shouldFetch = conceptUuids && conceptUuids.length > 0;
  const url = shouldFetch ? getConceptReferenceUrls(conceptUuids) : null;
  const { data, error, isLoading } = useSWRImmutable<FetchResponse<ConceptResponse>, Error>(
    shouldFetch ? `${restBaseUrl}/${url[0]}` : null,
    openmrsFetch,
  );

  const ob = data?.data;
  const orderReasons = ob
    ? Object.entries(ob).map(([key, value]) => ({
        uuid: value.uuid,
        display: value.display,
      }))
    : [];

  if (error) {
    showSnackbar({
      title: error.name,
      subtitle: error.message,
      kind: 'error',
    });
  }

  return { orderReasons: orderReasons, isLoading };
}

export interface MedicalSupplyOrderPost extends OrderPost {
  quantity?: number;
  quantityUnits?: string;
}

export function prepMedicalSupplyOrderPostData(
  order: MedicalSupplyOrderBasketItem,
  patientUuid: string,
  encounterUuid: string,
): MedicalSupplyOrderPost {
  let payload = {};
  if (order.action === 'NEW' || order.action === 'RENEW') {
    payload = {
      action: 'NEW',
      type: 'medicalsupplyorder',
      patient: patientUuid,
      careSetting: careSettingUuid,
      orderer: order.orderer,
      encounter: encounterUuid,
      concept: order.testType.conceptUuid,
      instructions: order.instructions,
      urgency: order.urgency,
      quantity: order.quantity,
      quantityUnits: order.quantityUnits,
      brandName: order.brandName,
    };
    return payload;
  } else if (order.action === 'REVISE') {
    payload = {
      action: 'REVISE',
      type: 'medicalsupplyorder',
      patient: patientUuid,
      careSetting: order.careSetting,
      orderer: order.orderer,
      encounter: encounterUuid,
      concept: order.testType.conceptUuid,
      instructions: order.instructions,
      urgency: order.urgency,
      quantity: order.quantity,
      quantityUnits: order.quantityUnits,
      brandName: order.brandName,
      previousOrder: order.previousOrder,
    };
    return payload;
  } else if (order.action === 'DISCONTINUE') {
    payload = {
      action: 'DISCONTINUE',
      type: 'medicalsupplyorder',
      patient: patientUuid,
      careSetting: order.careSetting,
      orderer: order.orderer,
      encounter: encounterUuid,
      concept: order.testType.conceptUuid,
      previousOrder: order.previousOrder,
    };
    return payload;
  } else {
    throw new Error(`Unknown order action: ${order.action}.`);
  }
}
const chunkSize = 10;
export function getConceptReferenceUrls(conceptUuids: Array<string>) {
  const accumulator = [];
  for (let i = 0; i < conceptUuids.length; i += chunkSize) {
    accumulator.push(conceptUuids.slice(i, i + chunkSize));
  }

  return accumulator.map((partition) => `conceptreferences?references=${partition.join(',')}&v=custom:(uuid,display)`);
}

export type PostDataPrepMedicalSupplyOrderFunction = (
  order: MedicalSupplyOrderBasketItem,
  patientUuid: string,
  encounterUuid: string,
) => OrderPost;

export interface ConceptAnswers {
  display: string;
  uuid: string;
}
export interface ConceptResponse {
  uuid: string;
  display: string;
  datatype: {
    uuid: string;
    display: string;
  };
  answers: Array<ConceptAnswers>;
  setMembers: Array<ConceptAnswers>;
}

export interface OpenmrsObject {
  uuid: string;
}

export type BaseOpenmrsObject = OpenmrsObject;

export interface SessionPriviledge {
  uuid: string;
  name: string;
}

export interface Person {
  uuid: string;
  display: string;
}

export interface Role {
  role: string;
  display: string;
}
export interface User {
  uuid: string;
  display: string;
  givenName: string;
  familyName: string;
  firstName: string;
  lastName: string;
  person?: Person;
  roles?: Role[];
  privileges: SessionPriviledge[];
}
export interface Auditable extends OpenmrsObject {
  creator: User;
  dateCreated: Date;
  changedBy: User;
  dateChanged: Date;
}
export interface Retireable extends OpenmrsObject {
  retired: boolean;
  dateRetired: Date;
  retiredBy: User;
  retireReason: string;
}

export interface ConceptName extends BaseOpenmrsObject {
  conceptNameId: number;
  concept: Concept;
  name: string;
  localePreferred: boolean;
  short: boolean;
  preferred: boolean;
  indexTerm: boolean;
  synonym: boolean;
  fullySpecifiedName: boolean;
}
export interface Concept extends BaseOpenmrsObject, Auditable, Retireable {
  conceptId: number;
  display: string;
  set: boolean;
  version: string;
  names: ConceptName[];
  name: ConceptName;
  numeric: boolean;
  complex: boolean;
  shortNames: ConceptName[];
  indexTerms: ConceptName[];
  synonyms: ConceptName[];
  setMembers: Concept[];
  possibleValues: Concept[];
  preferredName: ConceptName;
  shortName: ConceptName;
  fullySpecifiedName: ConceptName;
  answers: Concept[];
}

export function useConceptById(id: string) {
  const apiUrl = `ws/rest/v1/concept/${id}`;
  const { data, error, isLoading } = useSWR<
    {
      data: Concept;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <Concept>{},
    isLoading,
    isError: error,
  };
}
