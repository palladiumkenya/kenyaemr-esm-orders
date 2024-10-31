import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormLabel, InlineLoading } from '@carbon/react';
import { ExtensionSlot, showNotification, showToast, useConfig, usePatient, useSession } from '@openmrs/esm-framework';
import { closeOverlay } from '../hooks/useOverlay';
import { MedicationDispenseStatus, type InventoryItem, NonDrugMedicationDispense } from '../types';
import { revalidate } from '../utils';
import { type PharmacyConfig } from '../config-schema';
import { createStockDispenseRequestPayload, sendStockDispenseRequest } from './stock-dispense/stock.resource';
import { saveMedicationSupplyDispense } from '../medication-dispense/medication-dispense.resource';
import { updateMedicationRequestFulfillerStatus } from '../medication-request/medication-request.resource';
import MedicationDispenseReview from './medication-dispense-review.component';
import StockDispense from './stock-dispense/stock-dispense.component';
import styles from './forms.scss';

interface DispenseFormProps {
  medicationDispense: NonDrugMedicationDispense;
  mode: 'enter' | 'edit';
  patientUuid?: string;
  encounterUuid: string;
}

const DispenseForm: React.FC<DispenseFormProps> = ({ medicationDispense, mode, patientUuid, encounterUuid }) => {
  const { t } = useTranslation();
  const { patient, isLoading } = usePatient(patientUuid);
  const config = useConfig<PharmacyConfig>();
  const session = useSession();
  // Keep track of inventory item
  const [inventoryItem, setInventoryItem] = useState<InventoryItem>();

  // Keep track of medication dispense payload
  const [medicationDispensePayload, setMedicationDispensePayload] = useState<NonDrugMedicationDispense>();

  // whether or not the form is valid and ready to submit
  const [isValid, setIsValid] = useState(false);

  // to prevent duplicate submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit medication dispense form
  const handleSubmit = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const abortController = new AbortController();
      medicationDispensePayload.dispenser = session.currentProvider.uuid;
      medicationDispensePayload.location = session.sessionLocation.uuid;
      medicationDispensePayload.dateDispensed = new Date();
      delete medicationDispensePayload['uuid'];
      delete medicationDispensePayload['dispensingUnit'];
      delete medicationDispensePayload['dsiplay'];
      saveMedicationSupplyDispense(medicationDispensePayload, MedicationDispenseStatus.completed, abortController)
        .then((response) => {
          if (response.ok) {
            showToast({
              critical: true,
              kind: 'success',
              description: t('medicationDispenseSuccess', 'Medication Dispensed Successfully.'),
              title: t('dispenseSuccess', 'Dispense Success'),
            });
          }
          return response;
        })
        .then((response) => {
          const { status } = response;
          if (config.enableStockDispense && (status === 201 || status === 200)) {
            const stockDispenseRequestPayload = createStockDispenseRequestPayload(
              inventoryItem,
              patientUuid,
              encounterUuid,
              medicationDispensePayload,
            );
            sendStockDispenseRequest(stockDispenseRequestPayload, abortController).then(
              () => {
                showToast({
                  critical: true,
                  title: t('stockDispensed', 'Stock dispensed'),
                  kind: 'success',
                  description: t('stockDispensedSuccessfully', 'Stock dispensed successfully and batch level updated.'),
                });
              },
              (error) => {
                showToast({ title: 'Stock dispense error', kind: 'error', description: error?.message });
              },
            );
          }
          return response;
        })
        .then(
          ({ status }) => {
            if (status === 201 || status === 200) {
              closeOverlay();
              revalidate(encounterUuid);
              showToast({
                critical: true,
                kind: 'success',
                description: t('medicationListUpdated', 'Medication dispense list has been updated.'),
                title: t(
                  mode === 'enter' ? 'medicationDispensed' : 'medicationDispenseUpdated',
                  mode === 'enter' ? 'Medication successfully dispensed.' : 'Dispense record successfully updated.',
                ),
              });
            }
          },
          (error) => {
            showNotification({
              title: t(
                mode === 'enter' ? 'medicationDispenseError' : 'medicationDispenseUpdatedError',
                mode === 'enter' ? 'Error dispensing medication.' : 'Error updating dispense record',
              ),
              kind: 'error',
              critical: true,
              description: error?.message,
            });
            setIsSubmitting(false);
          },
        );
    }
  };

  // const checkIsValid = () => {
  //   if (
  //     medicationDispensePayload &&
  //     medicationDispensePayload.performer &&
  //     medicationDispensePayload.performer[0]?.actor.reference &&
  //     medicationDispensePayload.quantity?.value &&
  //     (!quantityRemaining || medicationDispensePayload?.quantity?.value <= quantityRemaining) &&
  //     medicationDispensePayload.quantity?.code &&
  //     medicationDispensePayload.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity?.value &&
  //     medicationDispensePayload.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity?.code &&
  //     medicationDispensePayload.dosageInstruction[0]?.route?.coding[0].code &&
  //     medicationDispensePayload.dosageInstruction[0]?.timing?.code.coding[0].code &&
  //     (!medicationDispensePayload.substitution.wasSubstituted ||
  //       (medicationDispensePayload.substitution.reason[0]?.coding[0].code &&
  //         medicationDispensePayload.substitution.type?.coding[0].code))
  //   ) {
  //     setIsValid(true);
  //   } else {
  //     setIsValid(false);
  //   }
  // };

  // initialize the internal dispense payload with the dispenses passed in as props

  useEffect(() => setMedicationDispensePayload(medicationDispense), [medicationDispense]);

  // check is valid on any changes
  // useEffect(checkIsValid, [medicationDispensePayload, quantityRemaining, inventoryItem]);

  let isButtonDisabled = (config.enableStockDispense ? !inventoryItem : false) || !isValid || isSubmitting;
  isButtonDisabled = false;
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
    <div>
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
          {medicationDispensePayload ? (
            <div>
              <MedicationDispenseReview
                medicationDispense={medicationDispensePayload}
                updateMedicationDispense={setMedicationDispensePayload}
              />
              {config.enableStockDispense && (
                <StockDispense
                  inventoryItem={inventoryItem}
                  medicationDispense={medicationDispense}
                  updateInventoryItem={setInventoryItem}
                />
              )}
            </div>
          ) : null}
        </section>
        <section className={styles.buttonGroup}>
          <Button disabled={isSubmitting} onClick={() => closeOverlay()} kind="secondary">
            {t('cancel', 'Cancel')}
          </Button>
          <Button disabled={isButtonDisabled} onClick={handleSubmit}>
            {t(
              mode === 'enter' ? 'dispensePrescription' : 'saveChanges',
              mode === 'enter' ? 'Dispense prescription' : 'Save changes',
            )}
          </Button>
        </section>
      </div>
    </div>
  );
};

export default DispenseForm;
