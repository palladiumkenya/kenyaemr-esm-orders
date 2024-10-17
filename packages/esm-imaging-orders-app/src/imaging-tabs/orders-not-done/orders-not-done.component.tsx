import React from 'react';
import { DataTableSkeleton } from '@carbon/react';
import { useOrdersWorklist } from '../../hooks/useOrdersWorklist';
import styles from '../test-ordered/tests-ordered.scss';
import GroupedOrdersTable from '../common/grouped-orders-table.component';
import { useTranslation } from 'react-i18next';
interface NotDoneProps {
  fulfillerStatus: string;
}
export const OrdersNotDone: React.FC<NotDoneProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorklist('', fulfillerStatus);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (workListEntries?.length >= 0) {
    return (
      <>
        <div>
          <div className={styles.headerBtnContainer}></div>
          <GroupedOrdersTable
            orders={workListEntries}
            showStatus={true}
            showStartButton={false}
            showActions={true}
            showOrderType={false}
            actions={[
              {
                actionName: 'radiology-reject-reason-modal',
                order: 1,
              },
            ]}
            title={t('ordersNotDone', 'Orders Not Done')}
          />
        </div>
      </>
    );
  }
};
export default OrdersNotDone;
