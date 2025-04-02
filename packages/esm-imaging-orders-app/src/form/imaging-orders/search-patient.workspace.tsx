import React, { useCallback } from 'react';
import { ExtensionSlot, launchWorkspaceGroup } from '@openmrs/esm-framework';
import { getPatientChartStore } from '@openmrs/esm-patient-common-lib';

const SearchPatientWorkspace = () => {
  const launchAddImagingOrderWorkspace = useCallback((patientUuid: string) => {
    launchWorkspaceGroup('add-imaging-order-workspace-group', {
      state: {
        patientUuid,
      },
      onWorkspaceGroupLaunch: () => {
        const store = getPatientChartStore();
        store.setState({
          patientUuid,
        });
      },
      workspaceToLaunch: {
        name: 'add-imaging-order',
      },
      workspaceGroupCleanup: () => {
        const store = getPatientChartStore();
        store.setState({
          patientUuid: undefined,
        });
      },
    });
  }, []);

  return (
    <div>
      <ExtensionSlot
        name="patient-search-bar-slot"
        state={{
          selectPatientAction: (patientUuid: string) => launchAddImagingOrderWorkspace(patientUuid),
          buttonProps: {
            kind: 'primary',
          },
        }}
      />
    </div>
  );
};

export default SearchPatientWorkspace;
