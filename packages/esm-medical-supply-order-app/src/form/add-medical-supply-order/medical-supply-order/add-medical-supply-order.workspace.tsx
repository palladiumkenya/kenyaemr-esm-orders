import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import capitalize from 'lodash-es/capitalize';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { ArrowLeft } from '@carbon/react/icons';
import { age, formatDate, parseDate, useLayoutType, usePatient } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { MedicalSupplyTypeSearch } from './medical-supply-type-search';
import { MedicalSupplyOrderForm } from './medical-supply-form.component';
import styles from './add-medical-supply-order.scss';
import { type MedicalSupplyOrderBasketItem } from '../../../types';

export interface AddMedicalSupplyOrderWorkspaceAdditionalProps {
  order?: MedicalSupplyOrderBasketItem;
}

export interface AddMedicalSupplyOrderWorkspace
  extends DefaultPatientWorkspaceProps,
    AddMedicalSupplyOrderWorkspaceAdditionalProps {}

export default function AddMedicalSupplyOrderWorkspace({
  order: initialOrder,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}: AddMedicalSupplyOrderWorkspace) {
  const { t } = useTranslation();

  const [currentMedicalSupplyOrder, setCurrentMedicalSupplyOrder] = useState(initialOrder);

  const isTablet = useLayoutType() === 'tablet';

  const cancelOrder = useCallback(() => {
    closeWorkspace({
      ignoreChanges: true,
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
    });
  }, [closeWorkspace]);

  if (!currentMedicalSupplyOrder) {
    return (
      <>
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
        <MedicalSupplyTypeSearch openMedicalSupplyForm={setCurrentMedicalSupplyOrder} />
      </>
    );
  } else {
    return (
      <MedicalSupplyOrderForm
        initialOrder={currentMedicalSupplyOrder}
        closeWorkspace={closeWorkspace}
        closeWorkspaceWithSavedChanges={closeWorkspaceWithSavedChanges}
        promptBeforeClosing={promptBeforeClosing}
      />
    );
  }
}
