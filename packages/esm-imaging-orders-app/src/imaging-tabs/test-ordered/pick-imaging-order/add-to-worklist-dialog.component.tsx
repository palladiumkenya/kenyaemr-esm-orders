import React, { useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, Checkbox, TextInput } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './add-to-worklist-dialog.scss';
import { restBaseUrl, showNotification, showSnackbar } from '@openmrs/esm-framework';
import { updateOrder } from './add-to-worklist-dialog.resource';
import { type Result } from '../../work-list/work-list.resource';
import { mutate } from 'swr';
import capitalize from 'lodash-es/capitalize';

interface AddImagingToWorkListModalProps {
  queueId;
  order: Result;
  closeModal: () => void;
}

const AddImagingToWorkListModal: React.FC<AddImagingToWorkListModalProps> = ({ order, closeModal }) => {
  const { t } = useTranslation();

  const [isReferredChecked, setIsReferredChecked] = useState(false);
  const [referredLocation, setReferredLocation] = useState('');

  const pickImagingOrder = async (event) => {
    event.preventDefault();

    const body = {
      fulfillerComment: '',
      fulfillerStatus: isReferredChecked ? 'EXCEPTION' : 'IN_PROGRESS',
    };

    try {
      const response = await updateOrder(order.uuid, body);
      if (response.ok) {
        showSnackbar({
          isLowContrast: true,
          title: t('pickedAnOrder', 'Picked an order'),
          kind: 'success',
          subtitle: t('pickSuccessfully', 'You have successfully picked an Order'),
        });

        closeModal();
      }
    } catch (error) {
      showNotification({
        title: t(`errorPicking an order', 'Error Picking an Order`),
        kind: 'error',
        critical: true,
        description: error?.message,
      });
    }
  };

  const handleCheckboxChange = () => {
    setIsReferredChecked(!isReferredChecked);
  };
  const orderName = capitalize(order?.concept?.display);
  const orderNumber = order?.orderNumber;
  return (
    <div>
      <Form onSubmit={pickImagingOrder}>
        <div className="cds--modal-header">
          <h3 className="cds--modal-header__heading">{t('pickRequest', 'Pick Request')}</h3>
        </div>
        <div className="cds--modal-content">
          <p>
            {t('confirmationPickupMessages', `Do you want to pick this order: {{orderName}} - {{orderNumber}}?`, {
              orderName,
              orderNumber,
            })}
          </p>
          <section className={styles.section}>
            <Checkbox
              checked={isReferredChecked}
              onChange={handleCheckboxChange}
              labelText={'Referred'}
              id="test-referred"
            />
            {isReferredChecked && (
              <TextInput
                type="text"
                id="referredLocation"
                labelText={'Enter Referred Location'}
                value={referredLocation}
                onChange={(e) => setReferredLocation(e.target.value)}
              />
            )}
          </section>
        </div>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button type="submit" onClick={pickImagingOrder}>
            {t('pickRequest', 'Pick Request')}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default AddImagingToWorkListModal;
