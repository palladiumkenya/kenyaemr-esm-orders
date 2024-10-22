import React from 'react';
import { useTranslation } from 'react-i18next';
import Overlay from '../components/overlay/overlay.component';
import { useOrdersWorklist } from '../hooks/useOrdersWorklist';
import GroupedOrdersTable from '../shared/ui/common/grouped-orders-table.component';
import { DataTableSkeleton } from '@carbon/react';
interface WorklistProps {
  fulfillerStatus: string;
}

const NotDoneList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
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
            showActions={false}
            showStatus={true}
            showOrderType={true}
            showStartButton={false}
            title={t('notDoneList', 'Not Done List')}
            actions={[
              {
                actionName: 'procedure-reject-reason-modal',
              },
            ]}
          />
        </div>
        <Overlay />
      </>
    );
  }
};

export default NotDoneList;
