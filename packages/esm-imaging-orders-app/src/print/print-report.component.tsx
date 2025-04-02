import React from 'react';
import styles from './print-report.scss';
import { useConfig, useSession, formatDate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { IdentifierType, Person } from '../utils/functions';
import startCase from 'lodash-es/startCase';
import dayjs from 'dayjs';
import { type Order } from '../types';

interface PrintableReportProps {
  approvedOrders: Order;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ approvedOrders }) => {
  const { t } = useTranslation();
  const { logo } = useConfig({ externalModuleName: '@kenyaemr/esm-login-app' });
  const { sessionLocation, user } = useSession();
  const location = sessionLocation?.display;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.printableHeader}>
          <p className={styles.heading}>
            {t('imagingReport', 'Imaging Report')} - {approvedOrders?.orderNumber}
          </p>
          {logo?.src && <img className={styles.img} height={60} width={250} src={logo.src} alt={logo.alt} />}
        </div>
        <div className={styles.printableBody}>
          <div className={styles.billDetails}>
            <p className={styles.itemHeading}>{t('reportSummaryTo', 'Report summary to')}</p>
            <p className={styles.itemLabel}>
              {t('name', 'Name')}: {startCase(approvedOrders?.patient?.person?.display)}
            </p>
            <p className={styles.itemLabel}>
              {t('identifier', 'Identifier')}: {approvedOrders?.patient?.identifiers[0]?.identifier}
            </p>
            <p className={styles.itemLabel}>
              {t('age', 'Age')}: {approvedOrders?.patient?.person?.age}
            </p>
            <p className={styles.itemLabel}>
              {t('gender', 'Gender')}:
              {approvedOrders?.patient?.person?.gender === 'M'
                ? ' Male'
                : approvedOrders?.patient?.person?.gender === 'F'
                ? ' Female'
                : ' Unknown'}
            </p>
            <p className={styles.itemLabel}>
              {t('orderDate', 'Order date')} {formatDate(new Date(approvedOrders?.dateActivated))}
            </p>
          </div>

          <div className={styles.facilityDetails}>
            <p className={styles.facilityName}>{location}</p>
            <p className={styles.facilityName}>{approvedOrders?.careSetting?.name}</p>
            <p className={styles.facilityName}>{t('kenya', 'Kenya')}</p>
          </div>
        </div>
        <div className={styles.printResults}>
          <p className={styles.itemHeading}>{t('procedure', 'Procedure')}</p>
          <div className={styles.reportSection}>
            <p className={styles.itemLabel}>{startCase(approvedOrders?.concept?.display)}</p>
          </div>
        </div>
        <div className={styles.printResults}>
          <p className={styles.itemHeading}>{t('findings', 'Findings')}</p>
          <div className={styles.reportSection}>
            <p className={styles.itemLabel}>{approvedOrders?.procedures[0]?.procedureReport}</p>
          </div>
        </div>
        <div className={styles.printResults}>
          <p className={styles.itemHeading}>{t('impressions', 'Impressions')}</p>
          <div className={styles.reportSection}>
            <p className={styles.itemLabel}>{approvedOrders?.procedures[0]?.procedureReason}</p>
          </div>
        </div>
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
