import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, LaboratoryPictogram } from '@openmrs/esm-framework';
import styles from './imagining-header.scss';

export const ImagingPageHeader: React.FC = () => {
  const { t } = useTranslation();
  // TODO Add correct illustration by registering the correct pictogram
  // https://github.com/openmrs/openmrs-esm-core/blob/8d4612d384f000990303365e0d8575ebf382bb4f/packages/framework/esm-styleguide/src/pictograms/pictogram-registration.ts#L9
  return (
    <PageHeader
      illustration={<LaboratoryPictogram />}
      title={t('imagingOrders', 'Imaging Orders')}
      className={styles.pageHeader}
    />
  );
};
