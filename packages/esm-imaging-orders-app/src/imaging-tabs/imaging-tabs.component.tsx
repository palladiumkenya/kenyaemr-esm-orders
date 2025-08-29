import React from 'react';
import { TabPanels, TabList, Tabs, Tab, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useImagingOrderStats } from '../shared/imaging.resource';
import { useOrdersWorkList } from '../hooks/useOrdersWorklist';
import { TestsOrdered } from './test-ordered/tests-ordered.component';
import WorkList from './work-list/work-list.component';
import { ReferredTests } from './referred-test/referred-ordered.component';
import { Review } from './review-ordered/review-ordered.component';
import { ApprovedOrders } from './approved/approved-orders.component';
import { OrdersNotDone } from './orders-not-done/orders-not-done.component';
import styles from './imaging-tabs.scss';

export const ImagingTabs: React.FC = () => {
  const { t } = useTranslation();
  const { activeOrdersCount, workListCount, referredTestsCount, ordersNotDoneCount } = useOrderCounts();
  const { pendingReviewCount, approvedOrdersCount } = useCompletedOrders();

  const tabsData = [
    { label: 'pendingOrders', text: t('activeOrders', 'Active Orders'), count: activeOrdersCount, component: <TestsOrdered /> },
    {
      label: 'workList',
      text: t('workList', 'WorkList'),
      count: workListCount,
      component: <WorkList fulfillerStatus="IN_PROGRESS" />,
    },
    { label: 'referredProcedures', text: t('referredOut', 'Referred Out'), count: referredTestsCount, component: <ReferredTests /> },
    { label: 'review', text: t('pendingReview', 'Pending Review'), count: pendingReviewCount, component: <Review /> },
    { label: 'approved', text: t('approved', 'Approved'), count: approvedOrdersCount, component: <ApprovedOrders /> },
    {
      label: 'notDone',
      text: t('notDone', 'Not Done'),
      count: ordersNotDoneCount,
      component: <OrdersNotDone fulfillerStatus="DECLINED" />,
    },
  ];

  return (
    <div className={styles.imagingTabsContainer}>
      <Tabs>
        <TabList aria-label="List of tabs" contained style={{ marginLeft: '1rem' }}>
          {tabsData.map(({ label, text, count }) => (
            <Tab key={label}>
              {t(label, text)} ({count})
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabsData.map(({ label, component }) => (
            <TabPanel key={label}>{component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

const useOrderCounts = () => {
  const { count: activeOrdersCount } = useImagingOrderStats('');
  const { count: workListCount } = useImagingOrderStats('IN_PROGRESS');
  const { count: referredTestsCount } = useImagingOrderStats('EXCEPTION');
  const { count: ordersNotDoneCount } = useImagingOrderStats('DECLINED');

  return { activeOrdersCount, workListCount, referredTestsCount, ordersNotDoneCount };
};

const useCompletedOrders = () => {
  const { workListEntries } = useOrdersWorkList('', 'COMPLETED');
  const pendingReview = workListEntries.filter((item) =>
    item.procedures?.some((procedure) => procedure.outcome !== 'SUCCESSFUL'),
  );
  const pendingReviewCount = pendingReview?.length ?? 0;
  const approved = workListEntries.filter((item) =>
    item.procedures?.some((procedure) => procedure.outcome === 'SUCCESSFUL'),
  );
  const approvedOrdersCount = approved?.length ?? 0;

  return { pendingReviewCount, approvedOrdersCount };
};
