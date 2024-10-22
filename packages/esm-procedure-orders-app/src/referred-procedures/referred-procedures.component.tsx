import React from 'react';
import { useOrdersWorklist } from '../hooks/useOrdersWorklist';
import GroupedOrdersTable from '../shared/ui/common/grouped-orders-table.component';
import { DataTableSkeleton } from '@carbon/react';
import { useTranslation } from 'react-i18next';
interface WorklistProps {
  fulfillerStatus: string;
}

const WorkList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorklist('', fulfillerStatus);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (workListEntries?.length >= 0) {
    return (
      <>
        <div>
          <GroupedOrdersTable
            orders={workListEntries}
            showActions={true}
            showStatus={true}
            showOrderType={true}
            showStartButton={false}
            title={t('referredProcedures', 'Referred Procedures')}
            actions={[{ actionName: 'postProcedureResultForm' }, { actionName: 'reject-procedure-order-dialog' }]}
          />
        </div>
      </>
    );
  }
};

export default WorkList;
