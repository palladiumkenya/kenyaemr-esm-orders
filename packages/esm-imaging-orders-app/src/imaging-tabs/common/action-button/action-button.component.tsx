import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, launchWorkspace } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import OrderActionExtension from './order-action-extension.component';
import { launchOverlay } from '../../../components/overlay/hook';
import ProcedureReportForm from '../../../results/result-form.component';
import { Result } from '../../work-list/work-list.resource';

interface ActionButtonProps {
  action: {
    actionName: string;
    order: number;
  };
  order: Result;
  patientUuid: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, order, patientUuid }) => {
  const { t } = useTranslation();

  const handleOpenImagingReportForm = () => {
    launchWorkspace('imaging-report-form', {
      patientUuid,
      order,
    });
  };

  switch (action.actionName) {
    case 'add-radiology-to-worklist-dialog':
      return <OrderActionExtension order={order as unknown as Order} />;

    case 'imaging-report-form':
      return (
        <Button kind="primary" onClick={handleOpenImagingReportForm}>
          {t('imagingReportForm', 'Imaging Report Form')}
        </Button>
      );

    case 'review-imaging-report-dialog':
    case 'radiology-reject-reason-modal':
    case 'reject-radiology-order-dialog':
      return (
        <Button
          kind={action.actionName === 'reject-radiology-order-dialog' ? 'danger' : 'tertiary'}
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
              .join(' '),
          )}
        </Button>
      );

    default:
      return null;
  }
};

export default ActionButton;
