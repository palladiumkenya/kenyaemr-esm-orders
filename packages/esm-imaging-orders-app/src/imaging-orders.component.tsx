import React, { useCallback, useState } from 'react';
import { ImagingPageHeader } from './header/imagining-header.component';
import { ImagingTabs } from './imaging-tabs/imaging-tabs.component';
import { launchWorkspace, useDefineAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import dayjs from 'dayjs';
import { Add } from '@carbon/react/icons';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './imaging-orders.scss';

const ImagingOrders: React.FC = () => {
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('imaging-date-filter', { dateRange, setDateRange });
  const { t } = useTranslation();

    const launchAddImagingOrderWorkspace = useCallback(() => {
      launchWorkspace('search-patient-workspace');
    }, []);


  return (
    <div>
      <ImagingPageHeader />
      <div className={styles.pageHeaderActions}>
        <Button renderIcon={Add} onClick={launchAddImagingOrderWorkspace}>
          {t('addImagingOrder', 'Add Imaging Order')}
        </Button>
      </div>
      <ImagingTabs />
    </div>
  );
};

export default ImagingOrders;
