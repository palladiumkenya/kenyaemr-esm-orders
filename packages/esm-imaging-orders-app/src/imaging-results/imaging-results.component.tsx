import React, { useState } from 'react';
import { formatDate, parseDate, useLayoutType } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} from '@carbon/react';

import { usePatientImagingResults } from './imaging-resource';
import styles from './imaging-results.scss';

type ImagingResultsComponentProps = {
  patientUuid: string;
};

const ImagingResultsComponent: React.FC<ImagingResultsComponentProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const responseSize = useLayoutType() === 'tablet' ? 'md' : 'sm';
  const { orders, isLoading } = usePatientImagingResults(patientUuid);

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  const headers = [
    { header: t('orderNo', 'Order No'), key: 'orderNumber' },
    { header: t('orderDate', 'Order Date'), key: 'orderDate' },
    { header: t('orderType', 'Order Type'), key: 'orderType' },
    { header: t('performer', 'Performer'), key: 'performer' },
  ];

  const rows = orders.map((order) => ({
    id: order.uuid,
    orderNumber: order.orderNumber,
    orderDate: formatDate(parseDate(order.dateActivated), { mode: 'standard', noToday: true }),
    orderType: order.concept.display,
    performer: order.orderer.display,
    report: order.procedures.map((procedure) => procedure.procedureReport).join(', '),
  }));

  return (
    <div className={styles.container}>
      <DataTable size={responseSize} useZebraStyle rows={rows} headers={headers}>
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
            <Table {...getTableProps()} aria-label={t('imagingResults', 'Imaging Results')}>
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
                {rows.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    <TableExpandedRow colSpan={headers.length + 1} {...getExpandedRowProps({ row })}>
                      <div className={styles.expandedRow}>
                        {orders[index].procedures.map((procedure) => (
                          <div className={styles.procedure} key={procedure.uuid}>
                            <h4>{t('findings', 'Findings')}</h4>
                            <p>{procedure.procedureReport}</p>
                            <h4>{t('impressions')}</h4>
                            <p>{procedure.impressions}</p>
                          </div>
                        ))}
                      </div>
                    </TableExpandedRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default ImagingResultsComponent;
