import React from 'react';
import { DataTableSkeleton } from '@carbon/react';
import { useOrdersWorklist } from '../../hooks/useOrdersWorklist';

import GroupedOrdersTable from '../common/grouped-orders-table.component';
import { useTranslation } from 'react-i18next';

export const TestsOrdered: React.FC = () => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorklist('', '');

  const testOrderAction = [
    {
      actionName: 'add-radiology-to-worklist-dialog',
      order: 1,
    },
    { actionName: 'reject-radiology-order-dialog', order: 2 },
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
