import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  ExtensionSlot,
  parseDate,
  formatDate,
  useLayoutType,
  usePatient,
  getPatientName,
  setCurrentVisit,
  launchWorkspaceGroup,
  useVisit,
  showToast,
} from '@openmrs/esm-framework';
import { getPatientChartStore } from '@openmrs/esm-patient-common-lib';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
  DataTable,
  TextAreaSkeleton,
  Button,
  Accordion,
  AccordionItem,
} from '@carbon/react';
import capitalize from 'lodash-es/capitalize';
import { useParams } from 'react-router-dom';
import { Close, FolderOpen } from '@carbon/react/icons';

import { usePatientOrders } from './search.resource';
import { type Result } from '../work-list/work-list.resource';
import ActionButton from '../../shared/ui/common/action-button/action-button.component';
import { getActionsForStatus, IMAGING_ORDERS_API_URL } from './action-helpers';
import EmptyPatientSearch from './empty-search/empty-patient-search.component';

import styles from './imaging-order-search.scss';

const ImagingOrderSearch: React.FC = () => {
  const params = useParams<{ patientUuid: string }>();
  const [patientUuid, setPatientUuid] = useState<string | undefined>(params.patientUuid);
  const { orders = [], isLoading } = usePatientOrders(patientUuid);
  const [selectedOrder, setSelectedOrder] = useState<Result | undefined>(undefined);

  useEffect(() => {
    setPatientUuid(params.patientUuid);
    setSelectedOrder(undefined);
  }, [params.patientUuid]);

  const handlePatientClose = () => {
    if (selectedOrder) {
      setSelectedOrder(undefined);
    } else {
      setPatientUuid(undefined);
    }
  };

  // Component mapping for the different views
  const views = {
    empty: EmptyPatientSearch,
    orderList: () => (
      <>
        <PatientHeader patientUuid={patientUuid!} handleClose={handlePatientClose} />
        <OrdersTable
          imagingOrders={orders}
          isLoading={isLoading}
          patientUuid={patientUuid!}
          handleSelectOrder={setSelectedOrder}
        />
      </>
    ),
    orderDetails: () => (
      <>
        <PatientHeader patientUuid={patientUuid!} handleClose={handlePatientClose} />
        <ImagingOrderDetails imagingOrder={selectedOrder!} />
      </>
    ),
  };

  const getCurrentView = () => {
    if (!patientUuid) return 'empty';
    if (selectedOrder) return 'orderDetails';
    return 'orderList';
  };

  const CurrentView = views[getCurrentView()];

  return (
    <div className={styles.container}>
      <ExtensionSlot
        className={styles.patientSearchBarSlot}
        name="patient-search-bar-slot"
        state={{
          selectPatientAction: setPatientUuid,
          buttonProps: { kind: 'secondary' },
        }}
      />
      <CurrentView />
    </div>
  );
};

export default ImagingOrderSearch;

type OrderTableProps = {
  imagingOrders: Array<Result>;
  isLoading: boolean;
  handleSelectOrder: (order: Result) => void;
  patientUuid: string;
};

const OrdersTable: React.FC<OrderTableProps> = ({ patientUuid, imagingOrders, isLoading, handleSelectOrder }) => {
  const { t } = useTranslation();
  const responseSize = useLayoutType() === 'tablet' ? 'md' : 'sm';
  const { activeVisit, isLoading: isLoadingVisits } = useVisit(patientUuid);

  const launchAddImagingOrderWorkspace = useCallback(
    (patientUuid: string) => {
      if (!activeVisit) {
        showToast({
          kind: 'error',
          title: 'No active visit',
          description: 'Start a visit to add an imaging order.',
        });
        return;
      }

      setCurrentVisit(patientUuid, activeVisit.uuid);
      launchWorkspaceGroup('add-imaging-order-workspace-group', {
        state: {
          patientUuid,
        },
        onWorkspaceGroupLaunch: () => {
          const store = getPatientChartStore();
          store.setState({
            patientUuid,
          });
        },
        workspaceToLaunch: {
          name: 'add-imaging-order',
        },
        workspaceGroupCleanup: () => {
          mutate((key) => typeof key === 'string' && key.startsWith(IMAGING_ORDERS_API_URL), undefined, {
            revalidate: true,
          });
          const store = getPatientChartStore();
          store.setState({
            patientUuid: undefined,
          });
          setCurrentVisit(null, null);
        },
      });
    },
    [patientUuid, activeVisit],
  );

  if (imagingOrders.length === 0 && !isLoading && !isLoadingVisits) {
    return (
      <>
        {activeVisit ? (
          <EmptyPatientSearch
            title={t('noImagingOrders', 'No imaging orders found')}
            subTitle={t('noImagingOrdersSubtitle', 'Selected patient has no imaging orders, please create an order')}
            launchForm={() => launchAddImagingOrderWorkspace(patientUuid)}
            buttonText={t('addImagingOrder', 'Add Imaging Order')}
          />
        ) : (
          <EmptyPatientSearch
            title={t('noActiveVisit', 'No active visit found')}
            subTitle={t('noActiveVisitSubtitle', 'Selected patient has no active visit, please create a visit')}
          />
        )}
      </>
    );
  }

  const headers = [
    { header: t('dateAndTime', 'Date and time'), key: 'dateTime' },
    { header: t('orderedBy', 'Ordered By'), key: 'orderedBy' },
    { header: t('imagingTest', 'Imaging Test'), key: 'imagingTest' },
    { header: t('status', 'Status'), key: 'status' },
  ];

  const rows = imagingOrders.map((order) => ({
    id: order.uuid,
    dateTime: formatDate(parseDate(order.dateActivated), { mode: 'standard', noToday: true }),
    orderedBy: order.orderer.display,
    imagingTest: order.concept.display,
    status: (
      <div className={styles.statusContainer}>
        {order.fulfillerStatus ?? 'NEW'}
        <Button
          size="xs"
          kind="ghost"
          renderIcon={FolderOpen}
          iconDescription={t('open', 'Open')}
          onClick={() => handleSelectOrder(order)}>
          {t('open', 'Open')}
        </Button>
      </div>
    ),
  }));

  if (isLoading || isLoadingVisits) {
    return <DataTableSkeleton size={responseSize} />;
  }

  return (
    <div className={styles.ordersTableContainer}>
      <DataTable size={responseSize} useZebraStyles rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getCellProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell {...getCellProps({ cell })}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </div>
  );
};

type PatientHeaderProps = {
  patientUuid: string;
  handleClose: () => void;
};

const PatientHeader: React.FC<PatientHeaderProps> = ({ patientUuid, handleClose }) => {
  const { patient, isLoading, error } = usePatient(patientUuid);
  const { t } = useTranslation();

  if (isLoading) {
    return <TextAreaSkeleton />;
  }

  if (error) {
    return <div>{t('errorLoadingPatient', 'Error loading patient: {{error}}', { error: error.message })}</div>;
  }

  if (!patient) {
    return null;
  }

  return (
    <div className={styles.patientHeader}>
      <div className={styles.patientInformation}>
        <span className={styles.patientName}>{getPatientName(patient)} &middot; </span>
        <span className={styles.patientGender}>{capitalize(patient?.gender)} &middot; </span>
        <span className={styles.patientIdentifier}>{patient?.identifier?.[0]?.value}</span>
      </div>
      <div className={styles.actions}>
        <Button size="sm" kind="ghost" renderIcon={Close} iconDescription={t('close', 'Close')} onClick={handleClose}>
          {t('close', 'Close')}
        </Button>
      </div>
    </div>
  );
};

type ImagingOrderDetailsProps = {
  imagingOrder: Result;
};

const ImagingOrderDetails: React.FC<ImagingOrderDetailsProps> = ({ imagingOrder }) => {
  const { t } = useTranslation();

  const currentActions = getActionsForStatus(imagingOrder);
  const hasImagingResults = imagingOrder.procedures.some(
    (procedure) => procedure.procedureReport || procedure.impressions,
  );

  return (
    <div className={styles.imagingOrderDetailsContainer}>
      <div className={styles.imagingOrderDetails}>
        <ImagingOrderRow title={t('urgency', 'Urgency')} value={imagingOrder.urgency ?? '--'} />
        <ImagingOrderRow
          title={t('imagingTestOrdered', 'Imaging Test Ordered')}
          value={imagingOrder.concept.display ?? '--'}
        />
        <ImagingOrderRow title={t('orderStatus', 'Order Status')} value={imagingOrder.fulfillerStatus ?? '--'} />
        <ImagingOrderRow title={t('orderNumber', 'Order Number')} value={imagingOrder.orderNumber ?? '--'} />
        <ImagingOrderRow
          title={t('orderDate', 'Order Date')}
          value={formatDate(parseDate(imagingOrder.dateActivated), { mode: 'standard', noToday: true }) ?? '--'}
        />
        <ImagingOrderRow title={t('orderedBy', 'Ordered By')} value={imagingOrder.orderer.display ?? '--'} />
        <ImagingOrderRow title={t('instructions', 'Instructions')} value={imagingOrder.instructions ?? '--'} />
      </div>
      {currentActions.length > 0 && (
        <div className={styles.actionButtons}>
          {currentActions
            .sort((a, b) => a.order - b.order)
            .map((action) => (
              <ActionButton
                key={action.actionName}
                action={action}
                order={imagingOrder}
                patientUuid={imagingOrder.patient?.uuid || ''}
              />
            ))}
        </div>
      )}

      {hasImagingResults && (
        <Accordion isFlush={true} className={styles.imagingOrderResults}>
          <AccordionItem title={t('imagingResults', 'Imaging Results')}>
            {imagingOrder.procedures.map((procedure) => (
              <div className={styles.procedure} key={procedure.uuid}>
                <h4>{t('findings', 'Findings')}</h4>
                <p>{procedure.procedureReport ?? '--'}</p>
                <h4>{t('impressions', 'Impressions')}</h4>
                <p>{procedure.impressions ?? '--'}</p>
              </div>
            ))}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

type ImagingOrderRowProps = {
  title: string;
  value: string;
};

const ImagingOrderRow: React.FC<ImagingOrderRowProps> = ({ title, value }) => {
  return (
    <div className={styles.imagingOrderDetailsRow}>
      <span className={styles.imagingOrderDetailsRowTitle}>{title}</span>
      <span className={styles.imagingOrderDetailsRowValue}>{value}</span>
    </div>
  );
};
