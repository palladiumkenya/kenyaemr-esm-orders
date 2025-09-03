import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Add } from '@carbon/react/icons';
import {
  PageHeader,
  LaboratoryPictogram,
  PageHeaderContent,
  launchWorkspace,
} from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import styles from './imagining-header.scss';

export const ImagingPageHeader: React.FC = () => {
  const { t } = useTranslation();

  const launchAddImagingOrderWorkspace = useCallback(() => {
    launchWorkspace('search-patient-workspace');
  }, []);

  return (
    <PageHeader>
      <PageHeaderContent illustration={<LaboratoryPictogram />} title={t('radiologyAndImaging', 'Radiology and Imaging')} />
      <div className={styles.pageHeaderActions}>
        <Button renderIcon={Add} onClick={launchAddImagingOrderWorkspace}>
          {t('addImagingOrder', 'Add Imaging Order')}
        </Button>
      </div>
    </PageHeader>
  );
};
