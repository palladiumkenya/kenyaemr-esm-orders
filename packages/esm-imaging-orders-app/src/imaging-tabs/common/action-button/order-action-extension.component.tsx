import React from 'react';
import { Order } from '@openmrs/esm-patient-common-lib';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

type OrderActionProps = {
  order: Order;
};

const OrderActionExtension: React.FC<OrderActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const state = {
    order: order,
    modalName: 'add-radiology-to-worklist-dialog',
    actionText: t('pickImagingOrder', 'Pick Imaging Order'),
  };
  return <ExtensionSlot name="imaging-orders-action" state={state} />;
};

export default OrderActionExtension;
