import React from 'react';
import { type Order } from '@openmrs/esm-patient-common-lib';
import { ExtensionSlot, restBaseUrl } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

type OrderActionProps = {
  order: Order;
};

const OrderActionExtension: React.FC<OrderActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const state = {
    order: order,
    modalName: 'add-procedure-to-worklist-dialog',
    actionText: t('pickProcedureOrder', 'Pick Procedure Order'),
    additionalProps: { mutateUrl: `${restBaseUrl}/order` },
  };
  return <ExtensionSlot name="procedure-orders-action" state={state} />;
};

export default OrderActionExtension;
