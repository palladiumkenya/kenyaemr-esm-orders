import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Add } from '@carbon/react/icons';
import {
  PageHeader,
  PageHeaderContent,
  launchWorkspace,
  ExtensionSlot,
  useLayoutType,
  XrayPictogram,
} from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import styles from './imagining-header.scss';

export const ImagingPageHeader: React.FC = () => {
  const { t } = useTranslation();
  const responseSize = useLayoutType() === 'tablet' ? 'sm' : 'md';

  const launchAddImagingOrderWorkspace = useCallback(() => {
    launchWorkspace('search-patient-workspace');
  }, []);

  return (
    <div className={styles.pageHeader}>
      <PageHeader className={styles.PageHeader} data-testid="patient-queue-header">
        <PageHeaderContent illustration={<XrayPictogram />} title={t('radiologyAndImaging', 'Radiology and Imaging')} />{' '}
        <div className={styles.pageHeaderActions}>
          <ExtensionSlot className={styles.providerBannerInfoSlot} name="provider-banner-info-slot" />
          <Button className={styles.addImagingOrderButton} size={responseSize} renderIcon={Add} onClick={launchAddImagingOrderWorkspace}>
            {t('addImagingOrder', 'Add Imaging Order')}
          </Button>
        </div>
      </PageHeader>
    </div>
  );
};
