import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { useOrdersWorkList } from '../../hooks/useOrdersWorklist';
import GroupedOrdersTable from '../../shared/ui/common/grouped-orders-table.component';

export const ReferredTests: React.FC = () => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorkList('', 'EXCEPTION');

  return isLoading ? (
    <DataTableSkeleton />
  ) : (
    <div>
      <GroupedOrdersTable
        orders={workListEntries}
        showStatus={false}
        showStartButton={false}
        showActions={false}
        showOrderType={false}
        actions={[]}
        title={t('referredTests', 'Referred Tests')}
      />
    </div>
  );
};
