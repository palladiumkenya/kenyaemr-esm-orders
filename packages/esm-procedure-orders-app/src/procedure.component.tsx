import React, { useState } from 'react';
import { ProcedureHeader } from './header/procedure-header.component';
import ProcedureOrdersList from './procedures-ordered/procedure-tabs.component';
import { useDefineAppContext } from '@openmrs/esm-framework';
import dayjs from 'dayjs';

import { type DateFilterContext } from './types';

const Procedure: React.FC = () => {
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('procedures-date-filter', { dateRange, setDateRange });

  return (
    <div className={`omrs-main-content`}>
      <ProcedureHeader />
      <ProcedureOrdersList />
    </div>
  );
};

export default Procedure;
