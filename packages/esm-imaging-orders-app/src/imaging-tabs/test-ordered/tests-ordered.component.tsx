import React from 'react';
import { DataTableSkeleton } from '@carbon/react';
import { useOrdersWorkList } from '../../hooks/useOrdersWorklist';
import { useTranslation } from 'react-i18next';
import GroupedOrdersTable from '../../shared/ui/common/grouped-orders-table.component';

export const TestsOrdered: React.FC = () => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorkList('', '');

  const testOrderAction = [
    {
      actionName: 'add-imaging-to-work-list-modal',
      order: 1,
    },
    { actionName: 'reject-imaging-order-modal', order: 2 },
  ];

  if (isLoading) {
    return <DataTableSkeleton />;
  }
  return (
    <div>
      <GroupedOrdersTable
        orders={workListEntries}
        showStatus={true}
        showStartButton={false}
        showActions={true}
        showOrderType={false}
        actions={testOrderAction}
        title={t('testOrdered', 'Test Ordered')}
      />
    </div>
  );
};
