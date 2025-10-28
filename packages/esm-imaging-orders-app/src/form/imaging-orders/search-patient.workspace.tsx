import React, { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { ExtensionSlot, launchWorkspaceGroup, setCurrentVisit, useVisit } from '@openmrs/esm-framework';
import { getPatientChartStore } from '@openmrs/esm-patient-common-lib';

import styles from './search-patient-workspace.scss';

const SearchPatientWorkspace = () => {
  const [patientUuid, setPatientUuid] = useState<string | undefined>(undefined);
  const { activeVisit, isLoading: isLoadingVisits } = useVisit(patientUuid);

  const launchAddImagingOrderWorkspace = useCallback((patientUuid: string) => {
    setCurrentVisit(patientUuid, null);
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
        mutate((key) => typeof key === 'string' && key.startsWith('/ws/rest/v1/order'), undefined, {
          revalidate: true,
        });
        const store = getPatientChartStore();
        store.setState({
          patientUuid: undefined,
        });
        setCurrentVisit(null, null);
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <ExtensionSlot
        name="patient-search-bar-slot"
        state={{
          selectPatientAction: (patientUuid: string) => {
            setPatientUuid(patientUuid);
            launchAddImagingOrderWorkspace(patientUuid);
          },
          buttonProps: {
            kind: 'primary',
          },
        }}
      />
    </div>
  );
};

export default SearchPatientWorkspace;
