import React, { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import {
  ExtensionSlot,
  launchWorkspaceGroup,
  setCurrentVisit,
  useVisit,
  showSnackbar,
  type DefaultWorkspaceProps,
} from '@openmrs/esm-framework';
import { getPatientChartStore } from '@openmrs/esm-patient-common-lib';

import styles from './search-patient-workspace.scss';

const SearchPatientWorkspace: React.FC<DefaultWorkspaceProps> = ({ closeWorkspace }) => {
  const { t } = useTranslation();
  const [patientUuid, setPatientUuid] = useState<string | undefined>(undefined);
  const { activeVisit, isLoading: isLoadingVisits } = useVisit(patientUuid);

  const launchAddImagingOrderWorkspace = useCallback(
    (patientUuid: string) => {
      if (!activeVisit) {
        showSnackbar({
          kind: 'warning',
          title: t('noActiveVisit', 'No active visit'),
          subtitle: t('noActiveVisitSubtitle', 'Start a visit to add a procedure order.'),
          isLowContrast: true,
          timeoutInMs: 5000,
        });
        closeWorkspace();
        return;
      }

      setCurrentVisit(patientUuid, activeVisit.uuid);
      launchWorkspaceGroup('add-procedures-order-workspace-group', {
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
          name: 'add-procedures-order',
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
    },
    [activeVisit, t, closeWorkspace],
  );

  useEffect(() => {
    if (patientUuid && !isLoadingVisits) {
      launchAddImagingOrderWorkspace(patientUuid);
    }
  }, [patientUuid, isLoadingVisits, launchAddImagingOrderWorkspace]);

  return (
    <div className={styles.container}>
      <ExtensionSlot
        name="patient-search-bar-slot"
        state={{
          selectPatientAction: (patientUuid: string) => {
            setPatientUuid(patientUuid);
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
