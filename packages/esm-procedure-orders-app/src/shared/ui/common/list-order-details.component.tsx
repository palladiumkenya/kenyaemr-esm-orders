import {
  Accordion,
  AccordionItem,
  Button,
  InlineLoading,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
  TextArea,
} from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { formatDate, parseDate, showModal } from '@openmrs/esm-framework';
import capitalize from 'lodash-es/capitalize';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ActionButton from './action-button/action-button.component';
import { type ListOrdersDetailsProps } from './grouped-procedure-types';
import usePatientDiagnosis from './list-order-details.resource';
import styles from './list-order-details.scss';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = ({ groupedOrders, showActions, actions }) => {
  const orders = groupedOrders?.orders;
  const { t } = useTranslation();
  const orderRows = useMemo(() => {
    return orders
      ?.filter((item) => item.action === 'NEW')
      .map((entry) => ({
        ...entry,
        id: entry.uuid,
        orderNumber: entry.orderNumber,
        procedure: entry.display,
        status: entry.fulfillerStatus ? entry.fulfillerStatus : '--',
        urgency: entry.urgency,
        orderer: entry.orderer?.display,
        instructions: entry.instructions ? entry.instructions : '--',
        date: <span className={styles['single-line-display']}>{formatDate(parseDate(entry?.dateActivated))}</span>,
      }));
  }, [orders]);

  const { diagnoses, isLoading } = usePatientDiagnosis(orders[0]?.patient?.uuid);
  if (isLoading) {
    return <InlineLoading status="active" description={t('loading', 'Loading...')} />;
  }

  return (
    <div>
      {orderRows.map((row) => (
        <div key={row.uuid} className={styles.orderDetailsContainer}>
          <div className={styles.orderHeader}>
            <span className={styles.orderNumber}>
              {t('orderNumbers', 'Order number:')} {row?.orderNumber}
            </span>
            <span className={styles.orderDate}>
              {t('orderDate', 'Order Date:')} {row?.dateActivated ? formatDate(parseDate(row?.dateActivated)) : '--'}
            </span>
          </div>

          <div className={styles.orderStatus}>
            <span className={styles.urgencyStatus}>
              {t('orderStatus', 'Status:')}
              <Tag size="lg" type="warm-gray">
                {row.fulfillerStatus || t('orderNotPicked', 'Order not picked')}
              </Tag>
            </span>
          </div>

          <div className={styles.orderHeader}>
            <span className={styles.urgencyStatus}>
              {t('diagnosis', 'Diagnosis: ')}
              {diagnoses.length > 0 ? (
                diagnoses.map((diagnosis) => (
                  <Tag size="lg" type="warm-gray" key={diagnosis.id}>
                    {diagnosis.text ? capitalize(diagnosis.text) : t('noDiagnosis', 'No available diagnosis')}
                  </Tag>
                ))
              ) : (
                <Tag size="lg" type="warm-gray">
                  {t('noDiagnosis', 'No available diagnosis')}
                </Tag>
              )}
            </span>
            <span className={styles.urgencyStatus}>
              {t('urgencyStatus', 'Urgency: ')}
              <Tag size="lg" type="warm-gray">
                {capitalize(row.urgency || '--')}
              </Tag>
            </span>
          </div>

          <StructuredListWrapper>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell>{t('testOrdered', 'Test ordered: ')}</StructuredListCell>
                <StructuredListCell className={styles.orderName}>{capitalize(row?.display || '--')}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>
                  <span className={styles.instructionLabel}>{t('orderInStruction', 'Instructions: ')}</span>
                </StructuredListCell>
                <StructuredListCell>
                  {row?.instructions || (
                    <Tag size="lg" type="red">
                      {t('NoInstructionLeft', 'No instructions are provided.')}
                    </Tag>
                  )}
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
          {row.status === 'COMPLETED' && row.procedures?.[0]?.procedureReport && (
            <Accordion>
              <AccordionItem title={<span className={styles.accordionTitle}>{t('viewReport', 'View Report')}</span>}>
                <TextArea
                  className={styles.textAreaInput}
                  labelText={t('complication', 'Complication')}
                  id={`report-${row.uuid}`}
                  name={`report-${row.uuid}`}
                  value={row.procedures[0]?.encounters[0]?.obs[0]?.display}
                  readOnly
                />
                <TextArea
                  className={styles.textAreaInput}
                  labelText={t('procedureReport', 'Procedure report')}
                  id={`report-${row.uuid}`}
                  name={`report-${row.uuid}`}
                  value={row.procedures[0]?.procedureReport}
                  readOnly
                />
                <Button
                  kind="tertiary"
                  className={styles.printBtn}
                  onClick={() => {
                    const dispose = showModal('print-procedure-report-modal', {
                      onClose: () => dispose(),
                      completedOrder: row,
                    });
                  }}
                  size="sm"
                  renderIcon={() => <Printer size={18} />}>
                  {t('printReport', 'Print report')}
                </Button>
              </AccordionItem>
            </Accordion>
          )}

          <div className={styles.nameOrder}>
            {t('ordererName', 'Orderer Name: ')} {capitalize(row?.orderer || '--')}
          </div>
          {showActions && (
            <div className={styles.buttonSection}>
              <div className={styles.actionBtns}>
                {actions.map((action) => (
                  <ActionButton
                    key={action.actionName}
                    order={orders.find((order) => order.uuid === row.id)}
                    patientUuid={row.patient.uuid}
                    action={action}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListOrderDetails;
