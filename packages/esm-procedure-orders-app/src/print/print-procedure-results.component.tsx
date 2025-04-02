import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSet, ModalBody, ModalFooter, InlineNotification } from '@carbon/react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import styles from './print-procedure.scss';
import { Order, type Result } from '../types';
import PrintableReport from './print-procedure.component';

type PrintPreviewModalProps = {
  onClose: () => void;
  completedOrder: Result;
};

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ onClose, completedOrder }) => {
  const ordererName = completedOrder?.orderer;
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
          <PrintableReport completedOrder={completedOrder} ordererName={ordererName?.toString()} />
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
