import React, { useEffect, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Layer,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  Tile,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { formatDatetime, parseDate, useConfig } from '@openmrs/esm-framework';
import PrescriptionExpanded from './prescription-expanded.component';
import { type PharmacyConfig } from '../config-schema';
import styles from './prescriptions.scss';
import { useAllOrders } from '../hooks/useOrdersWorklist';
import { PrescriptionsTableRow } from '../types';

interface PrescriptionTabPanelProps {
  searchTerm: string;
  location: string;
  status: string;
}

const PrescriptionTabPanel: React.FC<PrescriptionTabPanelProps> = ({ searchTerm, location, status }) => {
  const { t } = useTranslation();
  const config = useConfig<PharmacyConfig>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);
  const { workListEntries: orders, isLoading, isError } = useAllOrders('', '');
  let orderEntries = [];
  if (status == 'ACTIVE' && orders.length > 0) {
    orderEntries = orders.filter((item) => item.fulfillerStatus == null);
  } else {
    orderEntries = orders;
  }
  let prescriptionsTableRows: PrescriptionsTableRow[];
  if (orderEntries) {
    prescriptionsTableRows = orderEntries.map((entry) => {
      return {
        id: entry?.uuid,
        created: entry?.dateActivated,
        concept: entry?.concept.uuid,
        patient: {
          name: entry?.patient?.display?.split('-')[1],
          uuid: entry?.patient?.uuid,
        },
        encounter: entry?.encounter?.uuid,
        nonDrugItem: entry?.display,
        lastDispenser: '',
        prescriber: entry?.orderer?.display?.split('-')[1],
        status: entry?.fulfillerStatus,
        location: null,
        drugDispenseQuantity: entry?.quantity,
        drugDispenseUnit: entry?.quantityUnits,
        quantityUnits: entry?.quantityUnits?.uuid,
      };
    });
    prescriptionsTableRows.sort((a, b) => (a.created < b.created ? 1 : -1));
  }
  let columns = [
    { header: t('created', 'Created'), key: 'created' },
    { header: t('patientName', 'Patient name'), key: 'patient' },
    { header: t('prescriber', 'Prescriber'), key: 'prescriber' },
    { header: t('item', 'Item'), key: 'nonDrugItem' },
    // { header: t('lastDispenser', 'Last dispenser'), key: 'lastDispenser' },
    { header: t('status', 'Status'), key: 'status' },
  ];
  // add the locations column, if enabled
  if (config.locationBehavior?.locationColumn?.enabled) {
    columns = [...columns.slice(0, 3), { header: t('location', 'Location'), key: 'location' }, ...columns.slice(3)];
  }

  // reset back to page 1 whenever search term changes
  useEffect(() => {
    setPage(1);
    setNextOffSet(0);
  }, [searchTerm]);
  return (
    <TabPanel>
      <div className={styles.patientListTableContainer}>
        {isLoading && <DataTableSkeleton role="progressbar" />}
        {isError && <p>Error</p>}
        {prescriptionsTableRows && (
          <>
            <DataTable rows={prescriptionsTableRows} headers={columns} isSortable>
              {({ rows, headers, getExpandHeaderProps, getHeaderProps, getRowProps, getTableProps }) => (
                <TableContainer>
                  <Table {...getTableProps()} useZebraStyles>
                    <TableHead>
                      <TableRow>
                        <TableExpandHeader {...getExpandHeaderProps()} />
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableExpandRow {...getRowProps({ row })}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>
                                {cell.id.endsWith('created')
                                  ? formatDatetime(parseDate(cell.value))
                                  : cell.id.endsWith('patient')
                                  ? cell.value.name
                                  : cell.id.endsWith('status')
                                  ? cell.value
                                    ? t(cell.value)
                                    : '--'
                                  : cell.value}
                              </TableCell>
                            ))}
                          </TableExpandRow>
                          {row.isExpanded ? (
                            <TableExpandedRow colSpan={headers.length + 1}>
                              <PrescriptionExpanded
                                encounterUuid={
                                  prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0]).encounter
                                }
                                patientUuid={row.cells.find((cell) => cell.id.endsWith('patient')).value.uuid}
                                medicationDispense={{
                                  uuid: row.id.split(':')[0],
                                  quantity: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .drugDispenseQuantity,
                                  display: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .nonDrugItem,
                                  dispensingUnit: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .drugDispenseUnit,
                                  encounter: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .encounter,
                                  patient: row.cells.find((cell) => cell.id.endsWith('patient')).value.uuid,
                                  medicalSupplyOrder: prescriptionsTableRows.find(
                                    (item) => item.id == row.id.split(':')[0],
                                  ).id,
                                  quantityUnits: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .drugDispenseUnit?.uuid,
                                  concept: prescriptionsTableRows.find((item) => item.id == row.id.split(':')[0])
                                    .concept,
                                  medicalSupplyOrderStatus: prescriptionsTableRows.find(
                                    (item) => item.id == row.id.split(':')[0],
                                  ).status,
                                }}
                              />
                            </TableExpandedRow>
                          ) : (
                            <TableExpandedRow className={styles.hiddenRow} colSpan={headers.length + 2} />
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
            {prescriptionsTableRows?.length === 0 && (
              <div className={styles.filterEmptyState}>
                <Layer>
                  <Tile className={styles.filterEmptyStateTile}>
                    <p className={styles.filterEmptyStateContent}>
                      {t('noPrescriptionsToDisplay', 'No prescriptions to display')}
                    </p>
                    <p className={styles.filterEmptyStateHelper}>{t('checkFilters', 'Check the filters above')}</p>
                  </Tile>
                </Layer>
              </div>
            )}
            {prescriptionsTableRows?.length > 0 && (
              <div style={{ width: '100%' }}>
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  pageSizes={[10, 20, 30, 40, 50, 100]}
                  totalItems={orderEntries?.length}
                  onChange={({ page, pageSize }) => {
                    setPage(page);
                    setNextOffSet((page - 1) * pageSize);
                    setPageSize(pageSize);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </TabPanel>
  );
};

export default PrescriptionTabPanel;
