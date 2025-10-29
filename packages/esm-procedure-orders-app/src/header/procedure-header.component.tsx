import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  PageHeaderContent,
  ExtensionSlot,
  Assessment1Pictogram,
  launchWorkspace,
  useLayoutType,
} from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';

import styles from './procedure-header.scss';

export const ProcedureHeader: React.FC = () => {
  const { t } = useTranslation();
  const responseSize = useLayoutType() === 'tablet' ? 'sm' : 'md';
  const launchAddProcedureOrderWorkspace = useCallback(() => {
    launchWorkspace('procedure-order-search-patient-workspace', { workspaceName: 'add-procedures-order' });
  }, []);

  return (
    <div className={styles.pageHeader}>
      <PageHeader className={styles.PageHeader} data-testid="patient-queue-header">
        <PageHeaderContent illustration={<Assessment1Pictogram />} title={t('procedures', 'Procedures')} />{' '}
        <div className={styles.pageHeaderActions}>
          <ExtensionSlot className={styles.providerBannerInfoSlot} name="provider-banner-info-slot" />
          <Button
            className={styles.addImagingOrderButton}
            size={responseSize}
            renderIcon={Add}
            onClick={launchAddProcedureOrderWorkspace}>
            {t('addProcedureOrder', 'Add Procedure Order')}
          </Button>
        </div>
      </PageHeader>
    </div>
  );
};
