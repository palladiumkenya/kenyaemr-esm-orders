import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import styles from './work-list.scss';
import { useOrdersWorkList } from '../../hooks/useOrdersWorklist';
import { WorkListProps } from '../../shared/ui/common/grouped-imaging-types';
import GroupedOrdersTable from '../../shared/ui/common/grouped-orders-table.component';

const WorkList: React.FC<WorkListProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();
  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState('');

  const { workListEntries, isLoading } = useOrdersWorkList(activatedOnOrAfterDate, fulfillerStatus);

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
            showStartButton={true}
            showActions={true}
            showOrderType={false}
            actions={[
              { actionName: 'imaging-report-form', order: 1 },
              {
                actionName: 'reject-imaging-order-modal',
                order: 2,
              },
            ]}
            title={t('workList', 'Work List')}
          />
        </div>
      </>
    );
  }
};

export default WorkList;
