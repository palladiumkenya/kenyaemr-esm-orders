import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { mutate } from 'swr';
import styles from './review-imaging-form.scss';
import { useTranslation } from 'react-i18next';
import {
  createAttachment,
  showModal,
  showNotification,
  showSnackbar,
  useLayoutType,
  type UploadedFile,
} from '@openmrs/esm-framework';
import {
  Stack,
  Button,
  ButtonSet,
  InlineLoading,
  Table,
  TableBody,
  TextArea,
  TableRow,
  TableCell,
  Column,
} from '@carbon/react';
import classNames from 'classnames';
import { CardHeader, useAllowedFileExtensions } from '@openmrs/esm-patient-common-lib';
import { updateImagingProcedure } from '../../imaging-tabs/test-ordered/pick-imaging-order/add-to-worklist-dialog.resource';
import { DocumentAttachment } from '@carbon/react/icons';
import { type Result } from '../../imaging-tabs/work-list/work-list.resource';

interface ReviewOrderDialogProps {
  order: Result;
  closeWorkspace: () => void;
}

const ImagingReviewForm: React.FC<ReviewOrderDialogProps> = ({ order, closeWorkspace }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { allowedFileExtensions } = useAllowedFileExtensions();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patientUuid = order?.patient?.uuid;

  const tableData = useMemo(
    () => [
      { key: t('orderUrgency', 'Order Urgency'), value: order.urgency },
      {
        key: t('scheduleDate', 'Schedule date'),
        value: order.scheduledDate || new Date().toLocaleDateString(),
      },
      { key: t('bodySite', 'Body Site'), value: order.display },
      { key: t('laterality', 'Laterality'), value: order.laterality },
      { key: t('numberOfRepeats', 'Number of repeats'), value: order.numberOfRepeats },
      { key: t('frequency', 'Frequency'), value: order.frequency?.display },
    ],
    [order, t],
  );

  const showAddAttachmentModal = useCallback(() => {
    const close = showModal('capture-photo-modal', {
      saveFile: (file: UploadedFile) => createAttachment(patientUuid, file),
      allowedExtensions: allowedFileExtensions,
      closeModal: () => close(),
      multipleFiles: true,
      collectDescription: true,
    });
  }, [allowedFileExtensions, patientUuid]);

  const updateProcedures = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await updateImagingProcedure(order?.procedures[0]?.uuid, { outcome: 'SUCCESSFUL' });
      showSnackbar({
        isLowContrast: true,
        title: t('createResponse', 'Create Review'),
        kind: 'success',
        subtitle: t('pickSuccessfully', 'You have successfully created a review'),
      });
      closeWorkspace();
      mutate((key) => typeof key === 'string' && key.startsWith('/ws/rest/v1/procedure'));
      mutate((key) => typeof key === 'string' && key.startsWith('/ws/rest/v1/order'));
    } catch (error: any) {
      showNotification({
        title: t('errorPicking', 'Error Creating Review'),
        kind: 'error',
        critical: true,
        description: error?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form aria-label="imaging form" className={styles.form} onSubmit={updateProcedures}>
      <div className={styles.formContainer}>
        <Stack gap={7}>
          <div>
            <Column className={styles.widgetContainer}>
              <div className={styles.widgetCard}>
                <CardHeader title={t('imagingReport', 'Imaging Report')}>
                  <Button
                    kind="tertiary"
                    className={styles.actionButton}
                    onClick={showAddAttachmentModal}
                    size="sm"
                    renderIcon={() => <DocumentAttachment size={18} />}>
                    {t('attachReport', 'Attach report')}
                  </Button>
                </CardHeader>
              </div>
            </Column>
            <div className={styles.widgetContainer}>
              <div className={styles.orderDetails}>
                <Table size="lg" useZebraStyles={false} aria-label="sample table">
                  <TableBody>
                    {tableData.map(
                      (row, index) =>
                        row.key &&
                        row.value && (
                          <TableRow key={index}>
                            <TableCell>{row.key}</TableCell>
                            <TableCell>{row.value}</TableCell>
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
                <TextArea
                  className={styles.textAreaInput}
                  labelText={t('imagingReports', 'Imaging report')}
                  id="report"
                  name="report"
                  value={order?.procedures[0]?.procedureReport || ''}
                  readOnly
                />
                <TextArea
                  className={styles.textAreaInput}
                  labelText={t('impression', 'Impression note')}
                  id="nextNotes"
                  name="nextNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          <ButtonSet className={styles.buttonSet}>
            <Button size="lg" kind="secondary" onClick={closeWorkspace}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button disabled={isSubmitting} kind="primary" type="submit">
              {isSubmitting ? (
                <span style={{ display: 'flex', justifyItems: 'center' }}>
                  {t('submitting', 'Submitting...')} <InlineLoading status="active" iconDescription="Loading" />
                </span>
              ) : (
                t('approveClose', 'Approve & close')
              )}
            </Button>
          </ButtonSet>
        </Stack>
      </div>
    </form>
  );
};

export default ImagingReviewForm;
