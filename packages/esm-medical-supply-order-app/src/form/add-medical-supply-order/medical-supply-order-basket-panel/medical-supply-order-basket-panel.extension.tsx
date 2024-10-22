import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import { Add, ChevronDown, ChevronUp } from '@carbon/react/icons';
import { useLayoutType, closeWorkspace } from '@openmrs/esm-framework';
import { launchPatientWorkspace, type OrderBasketItem, useOrderBasket } from '@openmrs/esm-patient-common-lib';
import { prepMedicalSupplyOrderPostData } from '../api';
import styles from './medical-supply-order-basket-panel.scss';
import { type MedicalSupplyOrderBasketItem } from '../../../types';
import ImagingIcon from './medical-supply-icon.component';
import { MedicalSupplyOrderBasketItemTile } from './medical-supply-order-basket-item-tile.component';

/**
 * Designs: https://app.zeplin.io/project/60d59321e8100b0324762e05/screen/648c44d9d4052c613e7f23da
 */
export default function MedicalSupplyOrderBasketPanelExtension() {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { orders, setOrders } = useOrderBasket<MedicalSupplyOrderBasketItem>(
    'medicalsupply',
    prepMedicalSupplyOrderPostData,
  );
  const [isExpanded, setIsExpanded] = useState(orders.length > 0);
  const {
    incompleteOrderBasketItems,
    newOrderBasketItems,
    renewedOrderBasketItems,
    revisedOrderBasketItems,
    discontinuedOrderBasketItems,
  } = useMemo(() => {
    const incompleteOrderBasketItems: Array<MedicalSupplyOrderBasketItem> = [];
    const newOrderBasketItems: Array<MedicalSupplyOrderBasketItem> = [];
    const renewedOrderBasketItems: Array<MedicalSupplyOrderBasketItem> = [];
    const revisedOrderBasketItems: Array<MedicalSupplyOrderBasketItem> = [];
    const discontinuedOrderBasketItems: Array<MedicalSupplyOrderBasketItem> = [];

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

  const openNewMedicalSupplyForm = useCallback(() => {
    closeWorkspace('order-basket', {
      ignoreChanges: true,
      onWorkspaceClose: () => launchPatientWorkspace('add-medical-supply-order'),
    });
  }, []);

  const openEditMedicalSupplyForm = useCallback((order: OrderBasketItem) => {
    closeWorkspace('order-basket', {
      ignoreChanges: true,
      onWorkspaceClose: () => launchPatientWorkspace('add-medical-supply-order', { order }),
    });
  }, []);

  const removeMedicalSupplyOrder = useCallback(
    (order: MedicalSupplyOrderBasketItem) => {
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
          <h4 className={styles.heading}>{`${t('medicalSupplyOrders', 'Medical supply orders')} (${
            orders.length
          })`}</h4>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            kind="ghost"
            renderIcon={(props) => <Add size={16} {...props} />}
            iconDescription="Add medical supply order"
            onClick={openNewMedicalSupplyForm}
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
                    <MedicalSupplyOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openEditMedicalSupplyForm(order)}
                      onRemoveClick={() => removeMedicalSupplyOrder(order)}
                    />
                  ))}
                </>
              )}
              {newOrderBasketItems.length > 0 && (
                <>
                  {newOrderBasketItems.map((order) => (
                    <MedicalSupplyOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openEditMedicalSupplyForm(order)}
                      onRemoveClick={() => removeMedicalSupplyOrder(order)}
                    />
                  ))}
                </>
              )}

              {renewedOrderBasketItems.length > 0 && (
                <>
                  {renewedOrderBasketItems.map((order) => (
                    <MedicalSupplyOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openEditMedicalSupplyForm(order)}
                      onRemoveClick={() => removeMedicalSupplyOrder(order)}
                    />
                  ))}
                </>
              )}

              {revisedOrderBasketItems.length > 0 && (
                <>
                  {revisedOrderBasketItems.map((order) => (
                    <MedicalSupplyOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openEditMedicalSupplyForm(order)}
                      onRemoveClick={() => removeMedicalSupplyOrder(order)}
                    />
                  ))}
                </>
              )}

              {discontinuedOrderBasketItems.length > 0 && (
                <>
                  {discontinuedOrderBasketItems.map((order) => (
                    <MedicalSupplyOrderBasketItemTile
                      key={order.uuid}
                      orderBasketItem={order}
                      onItemClick={() => openEditMedicalSupplyForm(order)}
                      onRemoveClick={() => removeMedicalSupplyOrder(order)}
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
