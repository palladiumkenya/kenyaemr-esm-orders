import {
  Accordion,
  AccordionItem,
  Button,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
  TextArea,
  InlineLoading,
} from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { ExtensionSlot, formatDate, parseDate, showModal } from '@openmrs/esm-framework';
import capitalize from 'lodash-es/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionButton from './action-button/action-button.component';
import { ListOrdersDetailsProps } from './grouped-imaging-types';
import styles from './list-order-details.scss';
import usePatientDiagnosis from './list-order-details.resource';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = ({ groupedOrders, showActions, actions }) => {
  const { t } = useTranslation();
  const orders = groupedOrders?.orders || [];
  const patientUuid = orders[0]?.patient?.uuid;
  const { diagnoses, isLoading } = usePatientDiagnosis(patientUuid);

  if (isLoading) {
    return <InlineLoading status="active" description={t('loading', 'Loading...')} />;
  }

  return (
    <div>
      {orders.map((row) => (
        <div key={row.uuid} className={styles.orderDetailsContainer}>
          <div className={styles.orderHeader}>
            <span className={styles.orderNumber}>
              {t('orderNumbers', 'Order number:')} {row.orderNumber}
            </span>
            <span className={styles.orderDate}>
              {t('orderDate', 'Order Date:')} {row.dateActivated ? formatDate(parseDate(row.dateActivated)) : '--'}
            </span>
          </div>

          <div className={styles.orderHeader}>
            <span className={styles.urgencyStatus}>
              {t('orderStatus', 'Status:')}
              <Tag size="lg" type={row.fulfillerStatus ? 'green' : 'red'}>
                {capitalize(row.fulfillerStatus) || t('orderNotPicked', 'Order not picked')}
              </Tag>
            </span>
          </div>

          <div className={styles.orderHeader}>
            <span className={styles.urgencyStatus}>
              {t('diagnosis', 'Diagnosis: ')}
              {diagnoses.length > 0 ? (
                diagnoses.map((diagnosis) => (
                  <Tag size="lg" type="blue" key={diagnosis.id}>
                    {capitalize(diagnosis.text)}
                  </Tag>
                ))
              ) : (
                <Tag size="lg" type="red">
                  {t('noDiagnosisAvailable', 'No diagnosis available')}
                </Tag>
              )}
            </span>
            <span className={styles.urgencyStatus}>
              {t('urgencyStatus', 'Urgency: ')}
              <Tag size="lg" type="blue">
                {capitalize(row.urgency || '--')}
              </Tag>
            </span>
          </div>

          <StructuredListWrapper>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell>{t('testOrdered', 'Test ordered: ')}</StructuredListCell>
                <StructuredListCell className={styles.orderName}>{capitalize(row.display || '--')}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>
                  <span className={styles.instructionLabel}>{t('orderInStruction', 'Instructions: ')}</span>
                </StructuredListCell>
                <StructuredListCell>
                  {row.instructions || (
                    <Tag size="lg" type="red">
                      {t('NoInstructionLeft', 'No instructions are provided.')}
                    </Tag>
                  )}
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
          {row.isApproved && row.procedures?.[0]?.procedureReport && (
            <Accordion>
              <AccordionItem title={<span className={styles.accordionTitle}>{t('viewReport', 'View Report')}</span>}>
                <TextArea
                  className={styles.textAreaInput}
                  labelText={t('imagingReports', 'Imaging report')}
                  id={`report-${row.uuid}`}
                  name={`report-${row.uuid}`}
                  value={row.procedures[0].procedureReport}
                  readOnly
                />
                <ExtensionSlot
                  name="patient-chart-attachments-dashboard-slot"
                  state={{
                    patientUuid,
                  }}
                />
                <Button
                  kind="tertiary"
                  className={styles.printBtn}
                  onClick={() => {
                    const dispose = showModal('print-preview-Report-modal', {
                      onClose: () => dispose(),
                      approvedOrder: row,
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
            {t('ordererName', 'Orderer Name: ')} {capitalize(row.orderer?.display || '--')}
          </div>

          {showActions && (
            <div className={styles.buttonSection}>
              <div className={styles.actionBtns}>
                {actions
                  .sort((a, b) => a.order - b.order)
                  .map((action) => (
                    <ActionButton
                      key={action.actionName}
                      action={action}
                      order={row}
                      patientUuid={row.patient?.uuid || ''}
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
