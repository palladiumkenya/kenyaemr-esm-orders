import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import { Add, ChevronDown, ChevronUp } from '@carbon/react/icons';
import { useLayoutType, closeWorkspace, launchWorkspace } from '@openmrs/esm-framework';
import { type OrderBasketItem, useOrderBasket } from '@openmrs/esm-patient-common-lib';
import { ImagingOrderBasketItemTile } from './imaging-order-basket-item-tile.component';
import { prepImagingOrderPostData } from '../api';
import ImagingIcon from './imaging-icon.component';
import styles from './imaging-order-basket-panel.scss';
import { type ImagingOrderBasketItem } from '../../../types';

/**
 * Designs: https://app.zeplin.io/project/60d59321e8100b0324762e05/screen/648c44d9d4052c613e7f23da
 */
export default function ImagingOrderBasketPanelExtension() {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { orders, setOrders } = useOrderBasket<ImagingOrderBasketItem>('imaging', prepImagingOrderPostData);
  const [isExpanded, setIsExpanded] = useState(orders.length > 0);
  const {
    incompleteOrderBasketItems,
    newOrderBasketItems,
    renewedOrderBasketItems,
    revisedOrderBasketItems,
    discontinuedOrderBasketItems,
  } = useMemo(() => {
    const incompleteOrderBasketItems: Array<ImagingOrderBasketItem> = [];
    const newOrderBasketItems: Array<ImagingOrderBasketItem> = [];
    const renewedOrderBasketItems: Array<ImagingOrderBasketItem> = [];
    const revisedOrderBasketItems: Array<ImagingOrderBasketItem> = [];
    const discontinuedOrderBasketItems: Array<ImagingOrderBasketItem> = [];

    orders.forEach((order) => {
      if (order?.isOrderIncomplete) {
        incompleteOrderBasketItems.push(order);
      } else if (order.action === 'NEW') {
        newOrderBasketItems.push(order);
      } else if (order.action === 'RENEW') {
        renewedOrderBasketItems.push(order);
      } else if (order.action === 'REVISE') {
        revisedOrderBasketItems.push(order);
      } else if (order.action === 'DISCONTINUE') {
        discontinuedOrderBasketItems.push(order);
      }
    });

    return {
      incompleteOrderBasketItems,
      newOrderBasketItems,
      renewedOrderBasketItems,
      revisedOrderBasketItems,
      discontinuedOrderBasketItems,
    };
  }, [orders]);

  const launchImagingOrderForm = useCallback(() => {
    closeWorkspace('order-basket', {
      ignoreChanges: true,
      onWorkspaceClose: () => launchWorkspace('add-imaging-order'),
    });
  }, []);

  const openImagingOrderFormForEditing = useCallback((order: OrderBasketItem) => {
    closeWorkspace('order-basket', {
      ignoreChanges: true,
      onWorkspaceClose: () => launchWorkspace('add-imaging-order', { order }),
    });
  }, []);

  const removeLabOrder = useCallback(
    (order: ImagingOrderBasketItem) => {
      const newOrders = [...orders];
      newOrders.splice(orders.indexOf(order), 1);
      setOrders(newOrders);
    },
    [orders, setOrders],
  );

  useEffect(() => {
    setIsExpanded(orders.length > 0);
  }, [orders]);

  return (
    <Tile
      className={classNames(isTablet ? styles.tabletTile : styles.desktopTile, {
        [styles.collapsedTile]: !isExpanded,
      })}>
      <div className={styles.container}>
        <div className={styles.iconAndLabel}>
          <ImagingIcon isTablet={isTablet} />
          <h4 className={styles.heading}>{`${t('imagingOrders', 'Imaging orders')} (${orders.length})`}</h4>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            kind="ghost"
            renderIcon={(props) => <Add size={16} {...props} />}
            iconDescription="Add imaging order"
            onClick={launchImagingOrderForm}
            size={isTablet ? 'md' : 'sm'}>
            {t('add', 'Add')}
          </Button>
          <Button
            className={styles.chevron}
            hasIconOnly
            kind="ghost"
            renderIcon={(props) =>
              isExpanded ? <ChevronUp size={16} {...props} /> : <ChevronDown size={16} {...props} />
            }
            iconDescription="View"
            disabled={orders.length === 0}
            onClick={() => setIsExpanded(!isExpanded)}>
            {t('add', 'Add')}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <>
          {orders.length > 0 && (
            <>
              {incompleteOrderBasketItems.length > 0 && (
                <>
                  {incompleteOrderBasketItems.map((order) => (
                    <ImagingOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openImagingOrderFormForEditing(order)}
                      onRemoveClick={() => removeLabOrder(order)}
                    />
                  ))}
                </>
              )}
              {newOrderBasketItems.length > 0 && (
                <>
                  {newOrderBasketItems.map((order) => (
                    <ImagingOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openImagingOrderFormForEditing(order)}
                      onRemoveClick={() => removeLabOrder(order)}
                    />
                  ))}
                </>
              )}

              {renewedOrderBasketItems.length > 0 && (
                <>
                  {renewedOrderBasketItems.map((order) => (
                    <ImagingOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openImagingOrderFormForEditing(order)}
                      onRemoveClick={() => removeLabOrder(order)}
                    />
                  ))}
                </>
              )}

              {revisedOrderBasketItems.length > 0 && (
                <>
                  {revisedOrderBasketItems.map((order) => (
                    <ImagingOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openImagingOrderFormForEditing(order)}
                      onRemoveClick={() => removeLabOrder(order)}
                    />
                  ))}
                </>
              )}

              {discontinuedOrderBasketItems.length > 0 && (
                <>
                  {discontinuedOrderBasketItems.map((order) => (
                    <ImagingOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openImagingOrderFormForEditing(order)}
                      onRemoveClick={() => removeLabOrder(order)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </Tile>
  );
}
