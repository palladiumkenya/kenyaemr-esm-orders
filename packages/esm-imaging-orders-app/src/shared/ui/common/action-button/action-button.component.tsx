import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, launchWorkspace } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import OrderActionExtension from './order-action-extension.component';
import { Result } from '../../../../imaging-tabs/work-list/work-list.resource';

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

  switch (action.actionName) {
    case 'add-imaging-to-work-list-modal':
      return <OrderActionExtension order={order as unknown as Order} />;

    case 'imaging-report-form':
      return (
        <Button kind="primary" onClick={handleOpenImagingReportForm}>
          {t('imagingReportForm', 'Imaging Report Form')}
        </Button>
      );

    case 'review-imaging-report-dialog':
    case 'reject-imaging-order-modal':
      return (
        <Button
          kind={action.actionName === 'reject-imaging-order-modal' ? 'danger' : 'tertiary'}
          onClick={() => {
            const dispose = showModal(action.actionName, {
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

export default ActionButton;
