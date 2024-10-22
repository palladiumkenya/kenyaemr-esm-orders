import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import capitalize from 'lodash-es/capitalize';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { ArrowLeft } from '@carbon/react/icons';
import {
  DefaultWorkspaceProps,
  age,
  formatDate,
  getPatientName,
  parseDate,
  useLayoutType,
  usePatient,
} from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { TestTypeSearch } from './imaging-type-search';
import { ImagingOrderForm } from './imaging-order-form.component';
import styles from './add-imaging-order.scss';
import { type ImagingOrderBasketItem } from '../../../types';

export interface AddImagingOrderWorkspaceAdditionalProps {
  order?: ImagingOrderBasketItem;
}

export interface AddImagingOrderWorkspace extends DefaultWorkspaceProps, AddImagingOrderWorkspaceAdditionalProps {}

export default function AddImagingOrderWorkspace({
  order: initialOrder,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}: AddImagingOrderWorkspace) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { patient, isLoading: isLoadingPatient } = usePatient();
  const [currentLabOrder, setCurrentLabOrder] = useState(initialOrder as ImagingOrderBasketItem);

  const cancelOrder = useCallback(() => {
    closeWorkspace({
      ignoreChanges: true,
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
    });
  }, [closeWorkspace]);

  return (
    <div className={styles.container}>
      {isTablet && !isLoadingPatient && (
        <div className={styles.patientHeader}>
          <span className={styles.bodyShort02}>{patient ? getPatientName(patient) : '--'}</span>
          <span className={classNames(styles.text02, styles.bodyShort01)}>
            {capitalize(patient?.gender)} &middot; {age(patient?.birthDate)} &middot;{' '}
            <span>
              {formatDate(parseDate(patient?.birthDate), {
                mode: 'wide',
                time: false,
              })}
            </span>
          </span>
        </div>
      )}
      {!isTablet && (
        <div className={styles.backButton}>
          <Button
            kind="ghost"
            renderIcon={(props) => <ArrowLeft size={24} {...props} />}
            iconDescription="Return to order basket"
            size="sm"
            onClick={cancelOrder}>
            <span>{t('backToOrderBasket', 'Back to order basket')}</span>
          </Button>
        </div>
      )}
      {!currentLabOrder ? (
        <TestTypeSearch openLabForm={setCurrentLabOrder} />
      ) : (
        <ImagingOrderForm
          initialOrder={currentLabOrder}
          closeWorkspace={closeWorkspace}
          closeWorkspaceWithSavedChanges={closeWorkspaceWithSavedChanges}
          promptBeforeClosing={promptBeforeClosing}
        />
      )}
    </div>
  );
}
