import { type OrderBasketItem } from '@openmrs/esm-patient-common-lib';

export interface Concept {
  uuid: string;
  display: string;
  setMembers: [];
}

export interface MedicalSupplyOrderBasketItem extends OrderBasketItem {
  testType?: {
    label: string;
    conceptUuid: string;
  };
  urgency?: string;
  instructions?: string;
  quantity?: number;
  quantityUnits?: string;
  previousOrder?: string;
  brandName?: string;
}

export type OrderFrequency = CommonMedicalSupplyValueCoded;
export type DurationUnit = CommonMedicalSupplyValueCoded;

interface CommonMedicalSupplyProps {
  value: string;
  default?: boolean;
}

export interface CommonMedicalSupplyValueCoded extends CommonMedicalSupplyProps {
  valueCoded: string;
}

export interface Concept {
  display: string;
  uuid: string;
}
export interface MedicalSupply {
  concept: {
    uuid: string;
    display: string;
  };
  conceptName: {
    uuid: string;
    display: string;
  };
  display: string;
}
