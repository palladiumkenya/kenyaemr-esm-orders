import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useConfig, useSession } from '@openmrs/esm-framework';
import {
  MedicationDispenseStatus,
  type MedicationRequestBundle,
  MedicationRequestStatus,
  NonDrugMedicationDispense,
} from '../types';
import { launchOverlay } from '../hooks/useOverlay';
import {
  computeMedicationRequestStatus,
  computeQuantityRemaining,
  getMostRecentMedicationDispenseStatus,
} from '../utils';
import { type PharmacyConfig } from '../config-schema';
import { initiateMedicationDispenseBody, useProviders } from '../medication-dispense/medication-dispense.resource';
import DispenseForm from '../forms/dispense-form.component';
import PauseDispenseForm from '../forms/pause-dispense-form.component';
import CloseDispenseForm from '../forms/close-dispense-form.component';
import styles from './action-buttons.scss';

interface ActionButtonsProps {
  patientUuid: string;
  encounterUuid: string;
  medicationDispense: NonDrugMedicationDispense;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ patientUuid, encounterUuid, medicationDispense }) => {
  const { t } = useTranslation();
  const config = useConfig<PharmacyConfig>();
  const session = useSession();
  const providers = useProviders(config.dispenserProviderRoles);

  return (
    <div className={styles.actionBtns}>
      {medicationDispense.uuid ? (
        <Button
          kind="primary"
          onClick={() =>
            launchOverlay(
              t('dispensePrescription', 'Dispense prescription'),
              <DispenseForm
                patientUuid={patientUuid}
                encounterUuid={encounterUuid}
                medicationDispense={medicationDispense}
                mode="enter"
              />,
            )
          }>
          {t('dispense', 'Dispense')}
        </Button>
      ) : null}
      {medicationDispense.uuid ? (
        <Button
          kind="secondary"
          onClick={() =>
            launchOverlay(
              t('pausePrescription', 'Pause prescription'),
              <PauseDispenseForm
                medicationDispense={medicationDispense}
                patientUuid={patientUuid}
                encounterUuid={encounterUuid}
                mode="enter"
              />,
            )
          }>
          {t('pause', 'Pause')}
        </Button>
      ) : null}
      {medicationDispense.uuid ? (
        <Button
          kind="danger"
          onClick={() =>
            launchOverlay(
              t('closePrescription', 'Close prescription'),
              <CloseDispenseForm
                medicationDispense={medicationDispense}
                patientUuid={patientUuid}
                encounterUuid={encounterUuid}
                mode="enter"
              />,
            )
          }>
          {t('close', 'Close')}
        </Button>
      ) : null}
    </div>
  );
};

export default ActionButtons;
