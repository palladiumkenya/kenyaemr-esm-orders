import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';

import { EmptySvg } from './empty-svg.component';

import styles from './empty-patient-search.scss';

type BaseEmptyPatientSearchProps = {
  title?: string;
  subTitle?: string;
};

type WithLaunchForm = BaseEmptyPatientSearchProps & {
  launchForm: () => void;
  buttonText: string;
};

type WithoutLaunchForm = BaseEmptyPatientSearchProps & {
  launchForm?: never;
  buttonText?: never;
};

type EmptyPatientSearchProps = WithLaunchForm | WithoutLaunchForm;

const EmptyPatientSearch: React.FC<EmptyPatientSearchProps> = ({ title, subTitle, launchForm, buttonText }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.emptyStateContainer}>
      <EmptySvg />
      <p className={styles.title}>{title ?? t('searchForAPatient', 'Search for a patient')}</p>
      <p className={styles.subTitle}>
        {subTitle ?? t('enterAnIdNumberOrPatientName', 'Enter an ID number or patient name')}
      </p>
      {launchForm && buttonText && (
        <Button onClick={launchForm} kind="ghost" renderIcon={Add}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyPatientSearch;
