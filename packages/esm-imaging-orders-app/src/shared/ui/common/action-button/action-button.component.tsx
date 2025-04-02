import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, launchWorkspace } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import OrderActionExtension from './order-action-extension.component';
import { type Result } from '../../../../imaging-tabs/work-list/work-list.resource';
import styles from './action-button.scss';

type ActionButtonProps = {
  action: {
    actionName: string;
    order: number;
  };
  order: Result;
  patientUuid: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ action, order, patientUuid }) => {
  const { t } = useTranslation();

  const handleOpenImagingReportForm = () => {
    launchWorkspace('imaging-report-form', {
      patientUuid,
      order,
    });
  };

  const handleOpeningReviewWorkspace = () => {
    launchWorkspace('imaging-review-form', {
      order,
    });
  };

  const renderActionButton = () => {
    switch (action.actionName) {
      case 'add-imaging-to-work-list-modal':
        return <OrderActionExtension order={order as unknown as Order} />;

      case 'imaging-report-form':
        return (
          <Button kind="primary" size="md" onClick={handleOpenImagingReportForm} className={styles.actionButtons}>
            {t('imagingReportForm', 'Imaging Report Form')}
          </Button>
        );

      case 'imaging-review-form':
        return (
          <Button kind="primary" size="md" className={styles.actionButtons} onClick={handleOpeningReviewWorkspace}>
            {t('reviewImagingReport', 'Review Imaging Report')}
          </Button>
        );

      case 'amend-imaging-order-modal':
        return (
          <Button
            kind="secondary"
            size="md"
            className={styles.actionButtons}
            onClick={() => {
              const dispose = showModal('amend-imaging-order-modal', {
                closeModal: () => dispose(),
                order: order,
              });
            }}>
            {t('amendRequest', 'Amend request')}
          </Button>
        );

      case 'reject-imaging-order-modal':
        return (
          <Button
            kind="danger"
            size="md"
            className={styles.actionButtons}
            onClick={() => {
              const dispose = showModal('reject-imaging-order-modal', {
                closeModal: () => dispose(),
                order: order,
              });
            }}>
            {t(
              action.actionName.replace(/-/g, ''),
              action.actionName
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace('Modal', ''),
            )}
          </Button>
        );

      default:
        return null;
    }
  };

  return <div className={styles.actionButtonContainer}>{renderActionButton()}</div>;
};

export default ActionButton;
