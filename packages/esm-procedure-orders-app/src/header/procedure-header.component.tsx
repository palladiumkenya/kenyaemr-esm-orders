import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageHeaderContent, ExtensionSlot, Assessment1Pictogram } from '@openmrs/esm-framework';

import styles from './procedure-header.scss';

export const ProcedureHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <PageHeader data-testid="patient-queue-header">
        <PageHeaderContent illustration={<Assessment1Pictogram />} title={t('procedures', 'Procedures')} />
        <ExtensionSlot className={styles.providerBannerInfoSlot} name="provider-banner-info-slot" />
      </PageHeader>
    </div>
  );
};
