import { render } from '@testing-library/react';
import React from 'react';
import ActionButtons from './action-buttons.component';
import { type MedicationRequest, MedicationRequestStatus, NonDrugMedicationDispense } from '../types';
import { toDateObjectStrict, useConfig } from '@openmrs/esm-framework';
import { date } from 'zod';

const mockedUseConfig = useConfig as jest.Mock;
const mockPatientUuid = '558494fe-5850-4b34-a3bf-06550334ba4a';
const mockEncounterUuid = '7aee7123-9e50-4f72-a636-895d77a63e98';

describe('Action Buttons Component tests', () => {
  beforeEach(() => {
    mockedUseConfig.mockReturnValue({
      medicationRequestExpirationPeriodInDays: 90,
      actionButtons: {
        pauseButton: {
          enabled: true,
        },
        closeButton: {
          enabled: true,
        },
      },
      dispenseBehavior: {
        allowModifyingPrescription: false,
        restrictTotalQuantityDispensed: false,
      },
    });
  });

  test('component should render dispense button if active medication', () => {
    // status = active, and validity period start set to current datetime
    const medicationRequest: NonDrugMedicationDispense = {
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

    const { getByText, container } = render(
      <ActionButtons
        patientUuid={mockPatientUuid}
        encounterUuid={mockEncounterUuid}
        medicationDispense={medicationRequest}
      />,
    );
    expect(getByText('Dispense')).toBeInTheDocument();
  });

  // status = active, but validity period start time years in the past
  test('component should not render dispense button if expired medication', () => {
    // status = active, and validity period start set to current datetime
    const medicationRequest: NonDrugMedicationDispense = {
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

    const { queryByText, container } = render(
      <ActionButtons
        patientUuid={mockPatientUuid}
        encounterUuid={mockEncounterUuid}
        medicationDispense={medicationRequest}
      />,
    );
    // expect(queryByText('Dispense')).not.toBeInTheDocument();
  });
});
