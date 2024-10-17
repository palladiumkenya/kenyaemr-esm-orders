import React from 'react';
import { useOrdersWorklist } from '../../hooks/useOrdersWorklist';
import GroupedOrdersTable from '../common/grouped-orders-table.component';
import { DataTableSkeleton } from '@carbon/react';
import { useTranslation } from 'react-i18next';

export const Review: React.FC = () => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorklist('', 'COMPLETED');
  const pendingReview = workListEntries.filter((item) =>
    item.procedures?.some((procedure) => procedure.outcome !== 'SUCCESSFUL'),
  );
  return isLoading ? (
    <DataTableSkeleton />
  ) : (
    <div>
      <GroupedOrdersTable
        orders={pendingReview}
        showStatus={false}
        showStartButton={false}
        showActions={true}
        showOrderType={true}
        actions={[{ actionName: 'review-radilogy-report-dialog', order: 1 }]}
        title={t('reviewOrdered', 'Review Ordered')}
      />
    </div>
  );
};
