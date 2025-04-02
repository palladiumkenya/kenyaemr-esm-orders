import React, { useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, Checkbox, TextInput } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { restBaseUrl, showNotification, showSnackbar } from '@openmrs/esm-framework';
import { type Result } from '../../work-list/work-list.resource';
import { mutate } from 'swr';
import { updateOrder } from '../pick-imaging-order/add-to-worklist-dialog.resource';
import capitalize from 'lodash-es/capitalize';

interface AmendModalProps {
  queueId;
  order: Result;
  closeModal: () => void;
}

const AmendModal: React.FC<AmendModalProps> = ({ order, closeModal }) => {
  const { t } = useTranslation();

  const pickImagingOrder = async (event) => {
    event.preventDefault();

    const body = {
      fulfillerComment: '',
      fulfillerStatus: 'IN_PROGRESS',
    };

    try {
      const response = await updateOrder(order.uuid, body);
      if (response.ok) {
        showSnackbar({
          isLowContrast: true,
          title: t('amendAnOrder', 'Amend the order'),
          kind: 'success',
          subtitle: t('amendSuccessfully', 'You have successfully returned the order to worklist'),
        });
        mutate((key) => typeof key === 'string' && key.startsWith('/ws/rest/v1/procedure'), undefined, {
          revalidate: true,
        });

        mutate((key) => typeof key === 'string' && key.startsWith('/ws/rest/v1/order'), undefined, {
          revalidate: true,
        });
        closeModal();
      }
    } catch (error) {
      showNotification({
        title: t(`errorPicking an order', 'Error Amending an Order`),
        kind: 'error',
        critical: true,
        description: error?.message,
      });
    }
  };

  const orderName = capitalize(order?.concept?.display);
  const orderNumber = order?.orderNumber;
  return (
    <div>
      <Form onSubmit={pickImagingOrder}>
        <div className="cds--modal-header">
          <h3 className="cds--modal-header__heading">{t('amendRequest', 'Amend Request')}</h3>
        </div>
        <ModalBody>
          <section>
            <div className="cds--modal-content">
              <p>
                {t('confirmationMessages', `Do you want to amend this order {{orderName}} - {{orderNumber}}?`, {
                  orderName,
                  orderNumber,
                })}
                ;
              </p>
            </div>
          </section>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button type="submit" onClick={pickImagingOrder}>
            {t('amendRequest', 'Amend request')}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default AmendModal;
