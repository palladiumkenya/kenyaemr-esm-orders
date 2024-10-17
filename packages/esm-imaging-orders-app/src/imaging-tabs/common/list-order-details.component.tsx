import React, { useMemo } from 'react';
import styles from './list-order-details.scss';
import { useTranslation } from 'react-i18next';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import { ListOrdersDetailsProps } from './grouped-imaging-types';
import { Tile } from '@carbon/react';
import { OrderDetail } from './order-detail.component';
import ActionButton from './action-button/action-button.component';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const orders = props.groupedOrders?.orders;
  const { t } = useTranslation();
  const orderRows = useMemo(() => {
    return orders
      ?.filter((item) => item.action === 'NEW')
      .map((entry) => ({
        ...entry,
        id: entry.uuid,
        orderNumber: entry.orderNumber,
        procedure: entry.display,
        status: entry.fulfillerStatus ? entry.fulfillerStatus : '--',
        urgency: entry.urgency,
        orderer: entry.orderer?.display,
        instructions: entry.instructions ? entry.instructions : '--',
        date: <span className={styles['single-line-display']}>{formatDate(parseDate(entry?.dateActivated))}</span>,
      }));
  }, [orders]);

  return (
    <div className={styles.ordersContainer}>
      {orderRows.map((row, index) => (
        <Tile className={styles.orderTile}>
          {props.showActions && (
            <div className={styles.actionBtns}>
              {props.actions
                .sort((a, b) => {
                  // Replace 'property' with the actual property you want to sort by
                  if (a.order < b.order) return -1;
                  if (a.order > b.order) return 1;
                  return 0;
                })
                .map((action) => (
                  <ActionButton
                    key={action.actionName}
                    action={action}
                    order={orders.find((order) => order.uuid === row.id)}
                    patientUuid={row.patient.uuid}
                  />
                ))}
            </div>
          )}
          <div>
            <OrderDetail label={t('date', 'DATE').toUpperCase()} value={row.date} />
            <OrderDetail label={t('orderNumber', 'Order Number').toUpperCase()} value={row.orderNumber} />
            <OrderDetail label={t('procedure', 'procedure').toUpperCase()} value={row.procedure} />

            {props.showStatus && <OrderDetail label={t('status', 'Status').toUpperCase()} value={row.status} />}
            <OrderDetail label={t('urgency', 'urgency').toUpperCase()} value={row.urgency} />
            <OrderDetail label={t('orderer', 'orderer').toUpperCase()} value={row.orderer} />
            <OrderDetail label={t('instructions', 'Instructions').toUpperCase()} value={row.instructions} />
          </div>
        </Tile>
      ))}
    </div>
  );
};

export default ListOrderDetails;
