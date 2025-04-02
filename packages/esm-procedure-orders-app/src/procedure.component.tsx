import React, { useState } from 'react';
import { ProcedureHeader } from './header/procedure-header.component';
import ProcedureSummaryTiles from './summary-tiles/procedure-summary-tiles.component';
import ProcedureOrdersList from './procedures-ordered/procedure-tabs.component';
import Overlay from './components/overlay/overlay.component';
import { useDefineAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import dayjs from 'dayjs';

const Procedure: React.FC = () => {
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('procedures-date-filter', { dateRange, setDateRange });

  return (
    <div className={`omrs-main-content`}>
      <ProcedureHeader />
      <ProcedureSummaryTiles />
      <ProcedureOrdersList />
      <Overlay />
    </div>
  );
};

export default Procedure;
