import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import styles from './work-list.scss';
import Overlay from '../../components/overlay/overlay.component';
import { useOrdersWorklist } from '../../hooks/useOrdersWorklist';
import { WorklistProps } from '../common/grouped-imaging-types';
import GroupedOrdersTable from '../common/grouped-orders-table.component';

const WorkList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();
  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState('');

  const { workListEntries, isLoading } = useOrdersWorklist(activatedOnOrAfterDate, fulfillerStatus);

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
                actionName: 'reject-radiology-order-dialog',
                order: 2,
              },
            ]}
            title={t('workList', 'Work List')}
          />
        </div>
        <Overlay />
      </>
    );
  }
};

export default WorkList;
