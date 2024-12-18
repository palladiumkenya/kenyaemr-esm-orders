import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './empty-state.scss';
import { EmptyDataIllustration } from '@openmrs/esm-patient-common-lib';

interface EmptyStateProps {
  subTitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ subTitle }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.emptyStateContainer}>
      <EmptyDataIllustration />
      <p className={styles.subTitle}>{subTitle}</p>
    </div>
  );
};

export default EmptyState;
