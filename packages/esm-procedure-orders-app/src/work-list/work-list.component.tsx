import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './work-list.scss';
import Overlay from '../components/overlay/overlay.component';
import { useOrdersWorklist } from '../hooks/useOrdersWorklist';
import GroupedOrdersTable from '../shared/ui/common/grouped-orders-table.component';
import { DataTableSkeleton } from '@carbon/react';
import { type WorklistProps } from '../types';

const WorkList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();

  const { workListEntries, isLoading } = useOrdersWorklist('', fulfillerStatus);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <>
      <div>
        <div className={styles.headerBtnContainer}></div>
        <GroupedOrdersTable
          orders={workListEntries}
          showActions={true}
          showStatus={true}
          showOrderType={true}
          showStartButton={false}
          title={t('workList', 'Work List')}
          actions={[{ actionName: 'postProcedureResultForm' }, { actionName: 'reject-procedure-order-dialog' }]}
        />
      </div>
      <Overlay />
    </>
  );
};

export default WorkList;
