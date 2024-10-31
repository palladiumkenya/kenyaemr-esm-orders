import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComboBox, Dropdown, NumberInput, Stack, TextArea } from '@carbon/react';
import { OpenmrsDatePicker, useLayoutType, useConfig, useSession, userHasAccess } from '@openmrs/esm-framework';
import { getConceptCodingUuid, getMedicationReferenceOrCodeableConcept, getOpenMRSMedicineDrugName } from '../utils';
import MedicationCard from '../components/medication-card.component';
import { useMedicationCodeableConcept, useMedicationFormulations } from '../medication/medication.resource';
import { useMedicationRequest, usePrescriptionDetails } from '../medication-request/medication-request.resource';
import {
  useOrderConfig,
  useProviders,
  useSubstitutionReasonValueSet,
  useSubstitutionTypeValueSet,
} from '../medication-dispense/medication-dispense.resource';
import { PRIVILEGE_CREATE_DISPENSE_MODIFY_DETAILS } from '../constants';
import { NonDrugMedicationDispense, type Medication, type MedicationDispense } from '../types/index';
import { type PharmacyConfig } from '../config-schema';
import styles from '../components/medication-dispense-review.scss';
import dayjs from 'dayjs';

interface MedicationDispenseReviewProps {
  medicationDispense: NonDrugMedicationDispense;
  updateMedicationDispense: Function;
}

const MedicationDispenseReview: React.FC<MedicationDispenseReviewProps> = ({
  medicationDispense,
  updateMedicationDispense,
}) => {
  const { t } = useTranslation();
  const config = useConfig<PharmacyConfig>();
  const session = useSession();
  const [isEditingFormulation, setIsEditingFormulation] = useState(false);
  const [isSubstitution, setIsSubstitution] = useState(false);
  // Dosing Unit eg Tablets
  const [drugDosingUnits, setDrugDosingUnits] = useState([]);
  // Dispensing Unit eg Tablets
  const [drugDispensingUnits, setDrugDispensingUnits] = useState([]);
  // Route eg Oral
  const [drugRoutes, setDrugRoutes] = useState([]);
  // Frequency eg Twice daily
  const [orderFrequencies, setOrderFrequencies] = useState([]);
  // type of substitution question
  const [substitutionTypes, setSubstitutionTypes] = useState([]);
  // reason for substitution question
  const [substitutionReasons, setSubstitutionReasons] = useState([]);
  const [userCanModify, setUserCanModify] = useState(false);

  const isTablet = useLayoutType() === 'tablet';
  const prescriptionDate = Date.now();
  const allowEditing = config.dispenseBehavior.allowModifyingPrescription;

  const { orderConfigObject } = useOrderConfig();
  const { substitutionTypeValueSet } = useSubstitutionTypeValueSet(config.valueSets.substitutionType.uuid);
  const { substitutionReasonValueSet } = useSubstitutionReasonValueSet(config.valueSets.substitutionReason.uuid);
  const providers = useProviders(config.dispenserProviderRoles);

  useEffect(() => {
    if (orderConfigObject) {
      // sync drug route options order config
      const availableRoutes = drugRoutes.map((x) => x.id);
      const otherRouteOptions = [];
      orderConfigObject.drugRoutes.forEach(
        (x) => availableRoutes.includes(x.uuid) || otherRouteOptions.push({ id: x.uuid, text: x.display }),
      );
      setDrugRoutes([...drugRoutes, ...otherRouteOptions]);

      // sync dosage.unit options with what's defined in the order config
      const availableDosingUnits = drugDosingUnits.map((x) => x.id);
      const otherDosingUnits = [];
      orderConfigObject.drugDosingUnits.forEach(
        (x) => availableDosingUnits.includes(x.uuid) || otherDosingUnits.push({ id: x.uuid, text: x.display }),
      );
      setDrugDosingUnits([...drugDosingUnits, ...otherDosingUnits]);

      // sync dispensing unit options with what's defined in the order config
      const availableDispensingUnits = drugDispensingUnits.map((x) => x.id);
      const otherDispensingUnits = [];
      orderConfigObject.drugDispensingUnits.forEach(
        (x) => availableDispensingUnits.includes(x.uuid) || otherDispensingUnits.push({ id: x.uuid, text: x.display }),
      );
      setDrugDispensingUnits([...drugDispensingUnits, ...otherDispensingUnits]);

      // sync order frequency options with order config
      const availableFrequencies = orderFrequencies.map((x) => x.id);
      const otherFrequencyOptions = [];
      orderConfigObject.orderFrequencies.forEach(
        (x) => availableFrequencies.includes(x.uuid) || otherFrequencyOptions.push({ id: x.uuid, text: x.display }),
      );
      setOrderFrequencies([...orderFrequencies, ...otherFrequencyOptions]);
    }
  }, [orderConfigObject]);

  useEffect(() => {
    const substitutionTypeOptions = [];

    if (substitutionTypeValueSet?.compose?.include) {
      const uuidValueSet = substitutionTypeValueSet.compose.include.find((include) => !include.system);
      if (uuidValueSet) {
        uuidValueSet.concept?.forEach((concept) =>
          substitutionTypeOptions.push({
            id: concept.code,
            text: concept.display,
          }),
        );
      }
      substitutionTypeOptions.sort((a, b) => a.text.localeCompare(b.text));
    }
    setSubstitutionTypes(substitutionTypeOptions);
  }, [substitutionTypeValueSet]);

  useEffect(() => {
    const substitutionReasonOptions = [];

    if (substitutionReasonValueSet?.compose?.include) {
      const uuidValueSet = substitutionReasonValueSet.compose.include.find((include) => !include.system);
      if (uuidValueSet) {
        uuidValueSet.concept?.forEach((concept) =>
          substitutionReasonOptions.push({
            id: concept.code,
            text: concept.display,
          }),
        );
      }
      substitutionReasonOptions.sort((a, b) => a.text.localeCompare(b.text));
    }
    setSubstitutionReasons(substitutionReasonOptions);
  }, [substitutionReasonValueSet]);

  useEffect(() => {
    setUserCanModify(session?.user && userHasAccess(PRIVILEGE_CREATE_DISPENSE_MODIFY_DETAILS, session.user));
  }, [session]);

  return (
    <div className={styles.medicationDispenseReviewContainer}>
      <Stack gap={5}>
        <div className={styles.dispenseDetailsContainer}>
          <NumberInput
            allowEmpty={false}
            disabled={!userCanModify}
            hideSteppers={true}
            id="quantity"
            invalidText={t('numberIsNotValid', 'Number is not valid')}
            label={t('quantity', 'Quantity')}
            min={0}
            value={medicationDispense.quantity}
            onChange={(e) => {
              updateMedicationDispense({
                ...medicationDispense,
                quantity: {
                  ...medicationDispense.quantity,
                  value: e.target?.value ? parseFloat(e.target.value) : '',
                },
              });
            }}
          />

          <ComboBox
            id="quantityUnits"
            disabled={!userCanModify || !allowEditing}
            light={isTablet}
            items={drugDispensingUnits}
            titleText={t('drugDispensingUnit', 'Dispensing unit')}
            itemToString={(item) => item?.text}
            initialSelectedItem={{
              id: medicationDispense.dispensingUnit.uuid,
              text: medicationDispense.dispensingUnit.display,
            }}
            onChange={({ selectedItem }) => {
              updateMedicationDispense({
                ...medicationDispense,
                // note that we specifically recreate doesQuantity to overwrite any unit or system properties that may have been set
                quantity: {
                  value: medicationDispense.quantity,
                  code: selectedItem?.id,
                },
              });
            }}
            required
          />
        </div>

        <TextArea
          labelText={t('patientInstructions', 'Patient instructions')}
          value={medicationDispense.instrucions}
          maxLength={65535}
          onChange={(e) => {
            updateMedicationDispense({
              ...medicationDispense,
              instrucions: e.target.value,
            });
          }}
        />

        <OpenmrsDatePicker
          id="dispenseDate"
          labelText={t('dispenseDate', 'Date of Dispense')}
          minDate={prescriptionDate ? dayjs(prescriptionDate).startOf('day').toDate() : null}
          maxDate={dayjs().toDate()}
          // value={dayjs(medicationDispense.whenHandedOver).toDate()}
        ></OpenmrsDatePicker>

        {providers && (
          <ComboBox
            id="dispenser"
            light={isTablet}
            // initialSelectedItem={
            //   medicationDispense?.performer[0].actor.reference
            //     ? providers.find(
            //         (provider) => provider.uuid === medicationDispense?.performer[0].actor.reference.split('/')[1],
            //       )
            //     : null
            // }
            // onChange={({ selectedItem }) => {
            //   updateMedicationDispense({
            //     ...medicationDispense,
            //     performer: [
            //       {
            //         actor: {
            //           reference: `Practitioner/${selectedItem?.uuid}`,
            //         },
            //       },
            //     ],
            //   });
            // }}
            items={providers}
            itemToString={(item) => item?.person?.display}
            required
            titleText={t('dispensedBy', 'Dispensed by')}
          />
        )}
      </Stack>
    </div>
  );
};

export default MedicationDispenseReview;
