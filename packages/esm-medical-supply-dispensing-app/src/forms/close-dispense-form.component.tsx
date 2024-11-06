import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ExtensionSlot,
  showNotification,
  showToast,
  useConfig,
  useLayoutType,
  usePatient,
  useSession,
} from '@openmrs/esm-framework';
import { Button, ComboBox, InlineLoading } from '@carbon/react';
import {
  saveMedicationSupplyDispense,
  useReasonForCloseValueSet,
} from '../medication-dispense/medication-dispense.resource';
import { closeOverlay } from '../hooks/useOverlay';
import styles from './forms.scss';
import {
  type MedicationDispense,
  MedicationDispenseStatus,
  MedicationRequestFulfillerStatus,
  NonDrugMedicationDispense,
} from '../types';
import { type PharmacyConfig } from '../config-schema';
import { updateSupplyOrderFulfillerStatus } from '../medication-request/medication-request.resource';
import { revalidate } from '../utils';

interface CloseDispenseFormProps {
  medicationDispense: NonDrugMedicationDispense;
  mode: 'enter' | 'edit';
  patientUuid?: string;
  encounterUuid: string;
}
interface ReasonForClose {
  id: string;
  text: string;
}
const CloseDispenseForm: React.FC<CloseDispenseFormProps> = ({
  medicationDispense,
  mode,
  patientUuid,
  encounterUuid,
}) => {
  const { t } = useTranslation();
  const config = useConfig<PharmacyConfig>();
  const isTablet = useLayoutType() === 'tablet';
  const session = useSession();
  const { patient, isLoading } = usePatient(patientUuid);

  // Keep track of medication dispense payload
  const [medicationDispensePayload, setMedicationDispensePayload] = useState<NonDrugMedicationDispense>();

  // whether or not the form is valid and ready to submit
  const [isValid, setIsValid] = useState(false);

  // to prevent duplicate submits
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonsForClose, setReasonsForClose] = useState<ReasonForClose[]>([]);
  const { reasonForCloseValueSet } = useReasonForCloseValueSet(config.valueSets.reasonForClose.uuid);

  useEffect(() => {
    const reasonForCloseOptions = [
      {
        id: '737fa73a-509f-40d8-9e84-91dc71db7f4c',
        text: 'Order discontinued',
      },
    ];

    // if (reasonForPauseValueSet?.compose?.include) {
    //   const uuidValueSet = reasonForPauseValueSet.compose.include.find((include) => !include.system);
    //   if (uuidValueSet) {
    //     uuidValueSet.concept?.forEach((concept) =>
    //       reasonForPauseOptions.push({
    //         id: concept.code,
    //         text: concept.display,
    //       }),
    //     );
    //     reasonForPauseOptions.sort((a, b) => a.text.localeCompare(b.text));
    //   }
    // }
    setReasonsForClose(reasonForCloseOptions);
  }, [reasonForCloseValueSet]);

  const handleSubmit = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const abortController = new AbortController();
      medicationDispensePayload.dispenser = session.currentProvider.uuid;
      medicationDispensePayload.location = session.sessionLocation.uuid;
      medicationDispensePayload.dateDispensed = new Date();
      medicationDispensePayload.statusReason = reasonsForClose.find(
        (item) => item.id == medicationDispensePayload.statusReasonCodeableConcept,
      )?.text;
      delete medicationDispensePayload['uuid'];
      delete medicationDispensePayload['dispensingUnit'];
      delete medicationDispensePayload['dsiplay'];
      delete medicationDispensePayload['statusReasonCodeableConcept'];
      delete medicationDispensePayload['medicalSupplyOrderStatus'];
      saveMedicationSupplyDispense(medicationDispensePayload, MedicationDispenseStatus.declined, abortController)
        .then((response) => {
          // only update request status when added a new dispense event, not updating
          if (response.ok) {
            showToast({
              critical: true,
              kind: 'success',
              description: t('nonDrugItemsClosedSuccess', 'Dispensing Declined Successfully.'),
              title: t('DeclineSuccess', 'Declined Message'),
            });
          }
          return response;
        })
        .then((response) => {
          if (response.status === 201 || response.status === 200) {
            const body = {
              fulfillerComment: reasonsForClose.find(
                (item) => item.id == medicationDispensePayload.statusReasonCodeableConcept,
              )?.text,
              fulfillerStatus: 'DECLINED',
            };
            return updateSupplyOrderFulfillerStatus(medicationDispensePayload.medicalSupplyOrder, body);
          }
        })
        .then((response) => {
          if (response.ok) {
            closeOverlay();
            revalidate(encounterUuid);
            showToast({
              critical: true,
              kind: 'success',
              description: t(
                mode === 'enter' ? 'medicationDispenseClosed' : 'medicationDispenseUpdated',
                mode === 'enter' ? 'Medication dispense closed.' : 'Dispense record successfully updated.',
              ),
              title: t(
                mode === 'enter' ? 'medicationDispenseClosed' : 'medicationDispenseUpdated',
                mode === 'enter' ? 'Medication dispense closed.' : 'Dispense record successfully updated.',
              ),
            });
          }
        })
        .catch((error) => {
          showNotification({
            title: t(
              mode === 'enter' ? 'medicationDispenseCloseError' : 'medicationDispenseUpdatedError',
              mode === 'enter' ? 'Error closing medication dispense.' : 'Error updating dispense record',
            ),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
          setIsSubmitting(false);
        });
    }
  };

  const checkIsValid = () => {
    if (medicationDispensePayload && medicationDispensePayload.statusReasonCodeableConcept) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  // initialize the internal dispense payload with the dispenses passed in as props
  useEffect(() => setMedicationDispensePayload(medicationDispense), [medicationDispense]);

  // check is valid on any changes
  useEffect(checkIsValid, [medicationDispensePayload]);

  const bannerState = useMemo(() => {
    if (patient) {
      return {
        patient,
        patientUuid,
        hideActionsOverflow: true,
      };
    }
  }, [patient, patientUuid]);

  return (
    <div className="">
      <div className={styles.formWrapper}>
        {isLoading && (
          <InlineLoading
            className={styles.bannerLoading}
            iconDescription="Loading"
            description="Loading banner"
            status="active"
          />
        )}
        {/* {patient && <ExtensionSlot name="patient-header-slot" state={bannerState} />} */}
        <section className={styles.formGroup}>
          <ComboBox
            id="reasonForPause"
            light={isTablet}
            items={reasonsForClose}
            titleText={t('reasonForClose', 'Reason for Close')}
            itemToString={(item) => item?.text}
            initialSelectedItem={reasonsForClose.find(
              (item) => item.id == medicationDispensePayload.statusReasonCodeableConcept,
            )}
            onChange={({ selectedItem }) => {
              setMedicationDispensePayload({
                ...medicationDispensePayload,
                statusReasonCodeableConcept: selectedItem?.id,
              });
            }}
          />
        </section>
        <section className={styles.buttonGroup}>
          {' '}
          <Button disabled={isSubmitting} onClick={() => closeOverlay()} kind="secondary">
            {t('cancel', 'Cancel')}
          </Button>
          <Button disabled={!isValid || isSubmitting} onClick={handleSubmit}>
            {t(mode === 'enter' ? 'close' : 'saveChanges', mode === 'enter' ? 'Close' : 'Save changes')}
          </Button>
        </section>
      </div>
    </div>
  );
};

export default CloseDispenseForm;
