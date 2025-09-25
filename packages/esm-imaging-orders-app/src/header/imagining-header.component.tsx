import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Add } from '@carbon/react/icons';
import {
  PageHeader,
  LaboratoryPictogram,
  PageHeaderContent,
  launchWorkspace,
  ExtensionSlot,
} from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import styles from './imagining-header.scss';

export const ImagingPageHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`omrs-main-content`}>
        <PageHeader className={styles.PageHeader} data-testid="patient-queue-header">
          <PageHeaderContent
            illustration={<LaboratoryPictogram />}
            title={t('radiologyAndImaging', 'Radiology and Imaging')}
          />{' '}
          <ExtensionSlot className={styles.providerBannerInfoSlot} name="provider-banner-info-slot" />
        </PageHeader>
      </div>
     
    </>
  );
};
