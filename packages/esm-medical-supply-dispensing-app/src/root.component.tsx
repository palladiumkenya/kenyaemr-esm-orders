import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';

const Root: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1>Medical Supply Dispensing</h1>
    </div>
  );
};

export default Root;
