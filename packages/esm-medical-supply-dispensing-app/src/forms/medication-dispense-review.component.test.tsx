import React from 'react';
import { render } from '@testing-library/react';
import { type MedicationDispense, MedicationDispenseStatus, type NonDrugMedicationDispense } from '../types';
import MedicationDispenseReview from './medication-dispense-review.component';
import { OpenmrsDatePicker, useConfig } from '@openmrs/esm-framework';

const mockUseConfig = jest.mocked(useConfig);
const mockOpenmrsDatePicker = jest.mocked(OpenmrsDatePicker);

beforeEach(() => {
  mockUseConfig.mockReturnValue({
    dispenseBehavior: {
      allowModifyingPrescription: false,
      restrictTotalQuantityDispensed: false,
    },
    valueSets: {
      substitutionType: { uuid: '123' },
      substitutionReason: { uuid: 'abc' },
    },
  });

  mockOpenmrsDatePicker.mockReturnValue(<div />);
});

describe('Medication Dispense Review Component tests', () => {
  test('component should render medication dispense review', () => {
    const medicationDispense: NonDrugMedicationDispense = {
      uuid: 'd4f69a68-1171-4e47-8693-478df18daf40',
      patient: 'd4f69a68-1171-4e47-8693-478df18daf40',
      encounter: 'd4f69a68-1171-4e47-8693-478df18daf40',
      dispensingUnit: { uuid: 'd4f69a68-1171-4e47-8693-478df18daf40', display: 'Test' },
      quantity: 2,
      display: 'test ',
      instrucions: 'test',
      status: '',
      medicalSupplyOrder: 'd4f69a68-1171-4e47-8693-478df18daf40',
      concept: '',
      dateDispensed: new Date(),
      statusReason: '',
      location: '',
      encounters: '',
      dispenser: '',
    };

    const mockUpdate: Function = jest.fn();
    render(<MedicationDispenseReview medicationDispense={medicationDispense} updateMedicationDispense={mockUpdate} />);

    // TODO test expected views and various interactions
  });
});
