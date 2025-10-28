import React from 'react';
import { useAppContext, OpenmrsDateRangePicker } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { type DateFilterContext } from '../../../types';

import styles from './orders-date-range-picker.scss';

type OrdersDateRangePickerProps = {};

export const OrdersDateRangePicker: React.FC<OrdersDateRangePickerProps> = () => {
  const currentDate = new Date();
  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('imaging-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };

  const { t } = useTranslation();

  const handleOrdersDateRangeChange = (dates: [Date | null | undefined, Date | null | undefined]) => {
    const startDate = dates[0] ?? dayjs().startOf('day').toDate();
    const endDate = dates[1] ?? new Date();
    setDateRange([startDate, endDate]);
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('filterByDateRange', 'Filter by date range')}</p>
      <OpenmrsDateRangePicker
        value={[dateRange[0], dateRange[1]]}
        onChange={handleOrdersDateRangeChange}
        maxDate={currentDate}
        light
      />
    </div>
  );
};
