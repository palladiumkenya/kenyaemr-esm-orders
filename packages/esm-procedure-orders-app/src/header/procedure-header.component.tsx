import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageHeaderContent, ExtensionSlot } from '@openmrs/esm-framework';
import ProcedureIllustration from './procedure-illustration.component';
import styles from './procedure-header.scss';

export const ProcedureHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`omrs-main-content`}>
        <PageHeader data-testid="patient-queue-header">
          <PageHeaderContent className={styles.pageHeader} illustration={<ProcedureIllustration />} title={t('procedure', 'Procedures')} />
          <ExtensionSlot className={styles.providerBannerInfoSlot} name="provider-banner-info-slot" />
        </PageHeader>
      </div>
    </>
  );
};
