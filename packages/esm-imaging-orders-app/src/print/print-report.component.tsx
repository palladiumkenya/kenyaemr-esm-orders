import React from 'react';
import styles from './print-report.scss';
import { useConfig, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { IdentifierType, Person } from '../utils/functions';
import startCase from 'lodash-es/startCase';
import dayjs from 'dayjs';

interface PrintableReportProps {
  Person: Person;
  Report: string;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ Person, Report }) => {
  const { t } = useTranslation();
  const { logo } = useConfig({ externalModuleName: '@kenyaemr/esm-login-app' });
  const { sessionLocation, user } = useSession();
  const location = sessionLocation?.display;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.printableHeader}>
          <p className={styles.heading}>{t('imagingReport', 'Imaging Report')}</p>
          {logo?.src && <img className={styles.img} height={60} width={250} src={logo.src} alt={logo.alt} />}
        </div>

        <div className={styles.printableBody}>
          <div className={styles.billDetails}>
            <p className={styles.itemHeading}>{t('reportSummaryTo', 'Report summary to')}</p>
            <p className={styles.itemLabel}>{startCase(Person?.display)}</p>
            <p className={styles.itemLabel}>
              {t('age', 'Age')} {Person?.age}
            </p>
            <p className={styles.itemLabel}>
              {t('gender', 'Gender')} {Person?.gender}
            </p>
          </div>

          <div className={styles.facilityDetails}>
            <p className={styles.facilityName}>{location}</p>
            <p className={styles.itemLabel}>Kenya</p>
          </div>
        </div>

        <div className={styles.printResults}>
          <p className={styles.itemHeading}>{t('imagingResults', 'Imaging Results')}</p>
          <div className={styles.reportSection}>
            <p className={styles.itemLabel}>{Report}</p>
          </div>
        </div>

        <p className={styles.itemHeadingGroup}>{t('anyAdditionalNotes', 'Any additional notes')}</p>
      </div>

      <section className={styles.sectionFooter}>
        <div
          style={{
            margin: '10px',
            display: 'flex',
            width: '500px',
            flexDirection: 'row',
          }}>
          <span style={{ fontSize: '14px', marginBottom: '10px' }}>
            Results Reviewed / Authorized by :<span style={{ marginLeft: '50px' }}>{user?.display}</span>
          </span>
        </div>
        <div
          style={{
            margin: '10px',
            display: 'flex',
            width: '500px',
            flexDirection: 'row',
          }}>
          <span style={{ fontSize: '14px', marginTop: '10px' }}>
            Sign : ............................................{' '}
          </span>
        </div>
      </section>
    </div>
  );
};

export default PrintableReport;
