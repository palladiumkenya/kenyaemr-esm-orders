import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton, Tag, Tile } from '@carbon/react';
import { WarningFilled } from '@carbon/react/icons';
import { type PatientUuid, useConfig, UserHasAccess } from '@openmrs/esm-framework';
import { type PharmacyConfig } from '../config-schema';
import {
  type AllergyIntolerance,
  type MedicationRequest,
  MedicationRequestCombinedStatus,
  NonDrugDispensingUnit,
  type NonDrugMedicationDispense,
} from '../types';
import { computeMedicationRequestCombinedStatus, getConceptCodingDisplay } from '../utils';
import { PRIVILEGE_CREATE_DISPENSE } from '../constants';
import ActionButtons from '../components/action-buttons.component';
import MedicationEvent from '../components/medication-event.component';
import styles from './prescription-details.scss';

const PrescriptionDetails: React.FC<{
  encounterUuid: string;
  patientUuid: PatientUuid;
  medicationDispense: NonDrugMedicationDispense;
}> = ({ encounterUuid, patientUuid, medicationDispense }) => {
  const { t } = useTranslation();
  const config = useConfig<PharmacyConfig>();

  return (
    <div className={styles.prescriptionContainer}>
      <h5 style={{ paddingTop: '8px', paddingBottom: '8px', fontSize: '0.9rem' }}>{t('prescribed', 'Prescribed')}</h5>

      <Tile className={styles.prescriptionTile}>
        {!(
          medicationDispense.medicalSupplyOrderStatus == 'COMPLETED' ||
          medicationDispense.medicalSupplyOrderStatus == 'DECLINED'
        ) && (
          <UserHasAccess privilege={PRIVILEGE_CREATE_DISPENSE}>
            <ActionButtons
              patientUuid={patientUuid}
              encounterUuid={encounterUuid}
              medicationDispense={medicationDispense}
            />
          </UserHasAccess>
        )}
        <MedicationEvent medicationDispense={medicationDispense} />
      </Tile>
    </div>
  );
};

export default PrescriptionDetails;
