import React, { useState } from 'react';
import { useDefineAppContext } from '@openmrs/esm-framework';
import dayjs from 'dayjs';

import { ImagingPageHeader } from './header/imagining-header.component';
import { ImagingTabs } from './imaging-tabs/imaging-tabs.component';
import { type DateFilterContext } from './types';

const ImagingOrders: React.FC = () => {
  const [dateRange, setDateRange] = useState<Array<Date>>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('imaging-date-filter', { dateRange, setDateRange });

  return (
    <div>
      <ImagingPageHeader />
      <ImagingTabs />
    </div>
  );
};

export default ImagingOrders;
