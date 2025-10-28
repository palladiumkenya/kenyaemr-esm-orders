import { type Result } from '../work-list/work-list.resource';

export interface Action {
  actionName: string;
  order: number;
}

// NEW ORDER ACTIONS maps to fulfillerStatus = NEW
export const testOrderAction: Action[] = [
  {
    actionName: 'add-imaging-to-work-list-modal',
    order: 1,
  },
  { actionName: 'reject-imaging-order-modal', order: 2 },
];

// IN PROGRESS ACTIONS maps to fulfillerStatus = IN_PROGRESS
export const inProgressAction: Action[] = [
  { actionName: 'imaging-report-form', order: 1 },
  {
    actionName: 'reject-imaging-order-modal',
    order: 2,
  },
];

// REVIEW ACTIONS maps to fulfillerStatus = COMPLETED
export const reviewAction: Action[] = [
  { actionName: 'imaging-review-form', order: 1 },
  { actionName: 'amend-imaging-order-modal', order: 2 },
];

/**
 * Determine which action array to use based on fulfillerStatus
 * @param imagingOrder - The imaging order object
 * @returns Array of actions appropriate for the current fulfiller status
 */
export const getActionsForStatus = (imagingOrder: Result): Action[] => {
  if (!imagingOrder.fulfillerStatus || imagingOrder.fulfillerStatus === 'NEW') {
    return testOrderAction;
  } else if (imagingOrder.fulfillerStatus === 'IN_PROGRESS') {
    return inProgressAction;
  } else if (imagingOrder.fulfillerStatus === 'COMPLETED') {
    // check if the procedure outcome is SUCCESSFUL
    if (imagingOrder.procedures?.some((procedure) => procedure.outcome === 'SUCCESSFUL')) {
      return [];
    } else {
      return reviewAction;
    }
  }
  // Default to testOrderAction if status is unknown
  return testOrderAction;
};
