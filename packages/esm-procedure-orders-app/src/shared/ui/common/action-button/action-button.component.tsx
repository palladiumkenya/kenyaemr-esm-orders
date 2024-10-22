import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, launchWorkspace } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import OrderActionExtension from './order-action-extension.component';
import { Result } from '../../../../types';
import { launchOverlay } from '../../../../components/overlay/hook';
import PostProcedureForm from '../../../../form/post-procedures/post-procedure-form.component';

type ActionButtonProps = {
  action: {
    actionName: string;
  };
  order: Result;
  patientUuid: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ action, order, patientUuid }) => {
  const { t } = useTranslation();

  const handleOpenProcedureResultForm = () => {
    launchOverlay(
      t('procedureResultForm', 'Procedure Result Form'),
      <PostProcedureForm patientUuid={patientUuid} procedure={order} />,
    );
  };
  switch (action.actionName) {
    case 'add-procedure-to-worklist-dialog':
      return <OrderActionExtension order={order as unknown as Order} />;

    case 'postProcedureResultForm':
      return (
        <Button kind="primary" onClick={handleOpenProcedureResultForm}>
          {t('procedureResultForm', 'Procedure Result Form')}
        </Button>
      );

    case 'reject-procedure-order-dialog':
      return (
        <Button
          kind={action.actionName === 'reject-procedure-order-dialog' ? 'danger' : 'tertiary'}
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
