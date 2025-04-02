import React, { useState } from 'react';
import { ImagingPageHeader } from './header/imagining-header.component';
import { ImagingTabs } from './imaging-tabs/imaging-tabs.component';
import { useDefineAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import dayjs from 'dayjs';

const ImagingOrders: React.FC = () => {
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('imaging-date-filter', { dateRange, setDateRange });

  return (
    <div>
      <ImagingPageHeader />
      <ImagingTabs />
    </div>
  );
};

export default ImagingOrders;
