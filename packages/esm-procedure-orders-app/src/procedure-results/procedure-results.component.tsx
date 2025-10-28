import React from 'react';
import { mutate } from 'swr';
import { formatDate, parseDate, useLayoutType } from '@openmrs/esm-framework';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
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
  Button,
} from '@carbon/react';
import { Renew } from '@carbon/react/icons';

import { usePatientProcedureResults } from './procedures-resource';
import { type Procedure } from '../types';

import styles from './procedure-results.scss';

type ProcedureResultsComponentProps = {
  patientUuid: string;
};

const ProcedureResultsComponent: React.FC<ProcedureResultsComponentProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const responseSize = useLayoutType() === 'tablet' ? 'md' : 'sm';
  const { orders, isLoading } = usePatientProcedureResults(patientUuid);

  const handleRefresh = () => {
    mutate((key) => typeof key === 'string' && key.includes('/order?'), undefined, {
      revalidate: true,
    });
  };

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

  const getComplications = (procedure: Procedure) => {
    return (
      procedure.encounters?.map((encounter) => encounter.obs.map((obs) => obs.value?.display)).join(', ') ??
      t('noComplications', 'No complications')
    );
  };

  return (
    <div className={styles.container}>
      <CardHeader title={t('procedureResults', 'Procedure Results')}>
        <Button size={responseSize} kind="ghost" renderIcon={Renew} onClick={handleRefresh}>
          {t('refresh', 'Refresh')}
        </Button>
      </CardHeader>
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
            <Table {...getTableProps()} aria-label={t('procedureResults', 'Procedure Results')}>
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
                            <h4>{t('procedureReport', 'Procedure Report')}</h4>
                            <p>{procedure.procedureReport}</p>
                            <h4>{t('complications', 'Complications')}</h4>
                            <p>{getComplications(procedure)}</p>
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

export default ProcedureResultsComponent;
