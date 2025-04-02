import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { useOrdersWorkList } from '../../hooks/useOrdersWorklist';
import { type FulfillerStatus } from '../../shared/ui/common/grouped-imaging-types';
import GroupedOrdersTable from '../../shared/ui/common/grouped-orders-table.component';
import styles from '../test-ordered/tests-ordered.scss';
interface NotDoneProps {
  fulfillerStatus: FulfillerStatus;
}
export const OrdersNotDone: React.FC<NotDoneProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();
  const { workListEntries, isLoading } = useOrdersWorkList('', fulfillerStatus);

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
                actionName: 'reject-imaging-order-modal',
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
