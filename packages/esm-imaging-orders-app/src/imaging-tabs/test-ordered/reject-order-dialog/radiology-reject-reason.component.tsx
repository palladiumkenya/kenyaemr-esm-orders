import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './reject-order-dialog.scss';
import { Result } from '../../work-list/work-list.resource';

interface RejectImagingOrderModalProps {
  order: Result;
  closeModal: () => void;
}

const RejectImagingOrderModal: React.FC<RejectImagingOrderModalProps> = ({ order, closeModal }) => {
  const { t } = useTranslation();

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('rejectImagingOrder', 'Reject Imaging Order')} />
      <ModalBody>
        <div className={styles.modalBody}>
          <section className={styles.section}>
            <b />
            <Tile>
              <p>
                <b>{t('rejectionReason', 'Rejection Reason:')}</b>
              </p>
              <p className={styles.instructions}>{order.fulfillerComment}</p>
            </Tile>
          </section>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default RejectImagingOrderModal;
