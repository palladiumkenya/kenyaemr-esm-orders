import React from 'react';
import {
  NonDrugDispensingUnit,
  NonDrugMedicationDispense,
  type DosageInstruction,
  type MedicationDispense,
  type MedicationRequest,
  type Quantity,
} from '../types';
import styles from './medication-event.scss';

import { useTranslation } from 'react-i18next';

// can render MedicationRequest or MedicationDispense
const MedicationEvent: React.FC<{ medicationDispense: NonDrugMedicationDispense }> = ({ medicationDispense }) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className={styles.medicationName}>
        <strong>{medicationDispense.display}</strong>
      </p>

      <p className={styles.bodyLong01}>
        <span className={styles.label01}>{t('quantity', 'Quantity').toUpperCase()}</span>{' '}
        <span className={styles.quantity}> : {String(medicationDispense.quantity)} </span>
      </p>
      <p className={styles.bodyLong01}>
        <span className={styles.label01}>{t('dispenseUnit', 'Dispense Unit').toUpperCase()}</span>{' '}
        <span className={styles.quantity}> : {String(medicationDispense.dispensingUnit?.display)}</span>
      </p>
    </div>
  );
};

export default MedicationEvent;
