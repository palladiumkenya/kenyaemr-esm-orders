import { Result } from '../work-list/work-list.resource';

export interface WorklistProps {
  fulfillerStatus: string;
}

export interface ResultsOrderProps {
  order: Result;
  patientUuid: string;
}

export interface RejectOrderProps {
  order: Result;
}

export interface InstructionsProps {
  order: Result;
}

export interface GroupedOrders {
  patientId: string;
  orders: Array<Result>;
}
export interface GroupedOrdersTableProps {
  orders: Array<Result>;
  showStatus: boolean;
  showStartButton: boolean;
  showActions: boolean;
  showOrderType: boolean;
  actions: Array<OrderAction>;
  title: string;
}

export interface ListOrdersDetailsProps {
  groupedOrders: GroupedOrders;
  showStatus: boolean;
  showStartButton: boolean;
  showActions: boolean;
  showOrderType: boolean;
  actions: Array<OrderAction>;
}

export interface OrderAction {
  actionName: string;
  order: 0 | number;
}
