import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSet, ModalBody, ModalFooter, InlineNotification } from '@carbon/react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import PrintableReport from './print-report.component';
import styles from './print-report.scss';
import { IdentifierType, Person } from '../utils/functions';
import { Identifer } from '../../../esm-procedure-orders-app/src/types/index';
import { type Order } from '../types';

type PrintPreviewModalProps = {
  onClose: () => void;
  approvedOrder: Order;
};

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ onClose, approvedOrder }) => {
  const { t } = useTranslation();
  const [printError, setPrintError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      <ModalBody>
        <div ref={ref}>
          <PrintableReport approvedOrders={approvedOrder} />
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonSet className={styles.btnSet}>
          <Button kind="secondary" onClick={onClose} type="button">
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="primary" type="button" disabled={isLoading} onClick={handlePrint}>
            {t('print', 'Print')}
          </Button>
        </ButtonSet>
      </ModalFooter>

      {printError && (
        <InlineNotification kind="error" title={t('printError', 'Error')} subtitle={printError} hideCloseButton />
      )}
    </>
  );
};

export default PrintPreviewModal;
