import { type ProcedureOrderBasketItem } from '../../../types';
import { type ProceduresType } from './useProceduresTypes';

export const priorityOptions = [
  { value: 'STAT', label: 'Emergency' },
  { value: 'ROUTINE', label: 'Elective' },
  // { value: 'ON_SCHEDULED_DATE', label: 'Scheduled' },
];

export const categoryItems = [
  { value: '3c3946b1-d71d-41b3-a2e4-2d755006200a', label: 'Minor' },
  { value: '3798940f-87b8-464e-b36a-17da246f034e', label: 'Major' },
];

export function createEmptyLabOrder(testType: ProceduresType, orderer: string): ProcedureOrderBasketItem {
  return {
    action: 'NEW',
    display: testType.label,
    testType,
    orderer,
  };
}
