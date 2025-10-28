import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLayoutType, usePagination } from '@openmrs/esm-framework';
import upperCase from 'lodash-es/upperCase';
import { mutate } from 'swr';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableExpandedRow,
  TableExpandHeader,
  TableCell,
  DataTable,
  TableContainer,
  Search,
  Button
} from '@carbon/react';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { Renew } from '@carbon/react/icons';

import ListOrderDetails from './list-order-details.component';
import { type GroupedOrdersTableProps } from './grouped-imaging-types';
import { useSearchGroupedResults } from '../../../hooks/useSearchGroupedResults';
import TransitionLatestQueueEntryButton from '../../../imaging-tabs/test-ordered/transition-patient-new-queue/transition-latest-queue-entry-button.component';
import { OrdersDateRangePicker } from './orders-date-range-picker';
import EmptyState from '../../../empty-state/empty-state-component';

import styles from './grouped-orders-table.scss';

const GroupedOrdersTable: React.FC<GroupedOrdersTableProps> = (props) => {
  const workListEntries = props.orders;
  const { t } = useTranslation();
  const [currentPageSize] = useState<number>(10);
  const [searchString, setSearchString] = useState<string>('');
  const responseSize = useLayoutType() === 'tablet' ? 'md' : 'sm';

  function groupOrdersById(orders) {
    if (orders && orders.length > 0) {
      const groupedOrders = orders.reduce((acc, item) => {
        if (!acc[item.patient.uuid]) {
          acc[item.patient.uuid] = [];
        }
        acc[item.patient.uuid].push(item);
        return acc;
      }, {});

      // Convert the result to an array of objects with patientId and orders
      return Object.keys(groupedOrders).map((patientId) => ({
        patientId: patientId,
        orders: groupedOrders[patientId],
      }));
    } else {
      return [];
    }
  }
  const groupedOrdersByPatient = groupOrdersById(workListEntries);
  const searchResults = useSearchGroupedResults(groupedOrdersByPatient, searchString);
  const { goTo, results: paginatedResults, currentPage } = usePagination(searchResults, currentPageSize);

  const handleRefresh = () => {
    mutate((key) => typeof key === 'string' && key.includes('/order?'), undefined, {
      revalidate: true,
    });
  };
  const rowData = useMemo(() => {
    return paginatedResults.map((patient) => ({
      id: patient.patientId,
      patientName: upperCase(patient.orders[0].patient?.person?.display),
      patientAge: patient?.orders[0]?.patient?.person?.age,
      patientGender:
        patient?.orders[0]?.patient?.person?.gender === 'M'
          ? t('male', 'Male')
          : patient?.orders[0]?.patient?.person?.gender === 'F'
            ? t('female', 'Female')
            : patient?.orders[0]?.patient?.person?.gender,
      orders: patient.orders,
      totalOrders: patient.orders?.length,
      fulfillerStatus: patient.orders[0].fulfillerStatus,
      action:
        patient.orders[0].fulfillerStatus === 'COMPLETED' ? (
          <TransitionLatestQueueEntryButton patientUuid={patient.patientId} />
        ) : null,
    }));
  }, [paginatedResults, t]);

  const tableColumns = useMemo(() => {
    const baseColumns = [
      { key: 'patientName', header: t('patientName', 'Patient Name') },
      { key: 'patientAge', header: t('age', 'Age') },
      { key: 'patientGender', header: t('sex', 'Sex') },
      { key: 'totalOrders', header: t('totalOrders', 'Total Orders') },
    ];

    const showActionColumn = workListEntries.some((order) => order.fulfillerStatus === 'COMPLETED');

    return showActionColumn ? [...baseColumns, { key: 'action', header: t('action', 'Action') }] : baseColumns;
  }, [workListEntries, t]);

  if (rowData.length <= 0) {
    return (
      <>
        <div className={styles.widgetCard}>
          <CardHeader title={props?.title}>
            <div className={styles.elementContainer}>
              <OrdersDateRangePicker />
              <Search
                expanded
                persistent={true}
                onChange={(event) => setSearchString(event.target.value)}
                placeholder={t('searchByPatientName', 'Search by patient name')}
                size={responseSize}
              />
              <Button renderIcon={Renew} kind="ghost" size={responseSize} onClick={handleRefresh}>
                {t('refresh', 'Refresh')}
              </Button>
            </div>
          </CardHeader>
          <EmptyState subTitle={t('NoOrdersFound', 'There are no orders to display for this patient')} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader title={props?.title}>
          <div className={styles.elementContainer}>
            <OrdersDateRangePicker />
            <Search
              expanded
              persistent={true}
              onChange={(event) => setSearchString(event.target.value)}
              placeholder={t('searchByPatientName', 'Search by patient name')}
              size={responseSize}
            />
            <Button renderIcon={Renew} kind="ghost" size={responseSize} onClick={handleRefresh}>
              {t('refresh', 'Refresh')}
            </Button>
          </div>
        </CardHeader>
      </div>

      <DataTable size={responseSize} useZebraStyle rows={rowData} headers={tableColumns}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getExpandedRowProps,
          getTableProps,
          getTableContainerProps,
        }) => (
          <TableContainer className={styles.dataTable} {...getTableContainerProps()}>
            <Table {...getTableProps()} aria-label={t('imagingOrders', 'Imaging Orders')}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader aria-label={t('expandRow', 'Expand row')} />
                  {headers.map((header, i) => (
                    <TableHeader
                      key={i}
                      {...getHeaderProps({
                        header,
                      })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow
                      {...getRowProps({
                        row,
                      })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    <TableExpandedRow
                      colSpan={headers.length + 1}
                      {...getExpandedRowProps({
                        row,
                      })}>
                      <ListOrderDetails
                        actions={props.actions}
                        groupedOrders={groupedOrdersByPatient.find((item) => item.patientId === row.id)}
                        showActions={props.showActions}
                        showOrderType={props.showOrderType}
                        showStartButton={props.showStartButton}
                        showStatus={props.showStatus}
                      />
                    </TableExpandedRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

export default GroupedOrdersTable;
