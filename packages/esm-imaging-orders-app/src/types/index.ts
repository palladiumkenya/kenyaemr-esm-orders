import { type OrderUrgency, type OrderBasketItem } from '@openmrs/esm-patient-common-lib';

export interface Concept {
  uuid: string;
  display: string;
  conceptClass: {
    uuid: string;
    display: string;
    name: string;
  };
  answers: [];
  setMembers: [];
  hiNormal: number;
  hiAbsolute: number;
  hiCritical: number;
  lowNormal: number;
  lowAbsolute: number;
  lowCritical: number;
  units: string;
  allowDecimal: boolean;
  displayPrecision: null;
  attributes: [];
}

export interface ImagingOrderBasketItem extends OrderBasketItem {
  testType?: {
    label: string;
    conceptUuid: string;
  };
  urgency?: OrderUrgency;
  instructions?: string;
  orderReason?: string;
  orderReasonNonCoded?: string;
  scheduleDate?: Date | string;
  commentsToFulfiller?: string;
  laterality?: string;
  bodySite?: string;
}

export type OrderFrequency = CommonImagingValueCoded;
export type DurationUnit = CommonImagingValueCoded;

interface CommonImagingProps {
  value: string;
  default?: boolean;
}

export interface CommonImagingValueCoded extends CommonImagingProps {
  valueCoded: string;
}
export type DateFilterContext = {
  dateRange: Array<Date>;
  setDateRange: React.Dispatch<React.SetStateAction<Array<Date>>>;
};

export interface Order {
  uuid: string;
  orderNumber: string;
  patient: Patient;
  concept: Concept;
  action: string;
  careSetting: {
    name: string;
  };
  orderer: Orderer;
  urgency: string;
  instructions: any;
  bodySite: any;
  laterality: string;
  commentToFulfiller: any;
  procedures: Procedure[];
  display: string;
  fulfillerStatus: string;
  dateStopped: any;
  scheduledDate: any;
  dateActivated: string;
  fulfillerComment: string;
  isApproved: boolean;
}
interface Patient {
  uuid: string;
  display: string;
  identifiers: Identifier[];
  person: Person;
}
interface Identifier {
  identifier: string;
  identifierType: {
    display: string;
  };
  location: Location;
}

interface Location {
  display: string;
}
export interface Person {
  uuid: string;
  display: string;
  age: number;
  gender: string;
}

interface Orderer {
  uuid: string;
  display: string;
}

export interface Procedure {
  uuid: string;
  procedureOrder: ProcedureOrder;
  procedureReason: any;
  category: any;
  bodySite: any;
  partOf: any;
  startDatetime: any;
  endDatetime: any;
  status: string;
  statusReason: any;
  outcome: string;
  procedureReport: string;
  location: any;
  encounters: any[];
  resourceVersion: string;
}
interface ProcedureOrder {
  uuid: string;
  orderNumber: string;
  accessionNumber: any;
  action: string;
  previousOrder: any;
  dateActivated: string;
  scheduledDate: any;
  dateStopped: any;
  autoExpireDate: any;
  encounter: Encounter;
  orderReason: any;
  orderReasonNonCoded: string;
  orderType: OrderType;
  urgency: string;
  instructions: any;
  commentToFulfiller: any;
  display: string;
  specimenSource: any;
  laterality: string;
  clinicalHistory: any;
  frequency: any;
  numberOfRepeats: any;
  specimenType: any;
  bodySite: any;
  relatedProcedure: any;
  type: string;
  resourceVersion: string;
}

interface Encounter {
  uuid: string;
  display: string;
}

interface OrderType {
  uuid: string;
  display: string;
  name: string;
}
