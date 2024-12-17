import { type OrderBasketItem } from '@openmrs/esm-patient-common-lib';

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
  urgency?: string;
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
