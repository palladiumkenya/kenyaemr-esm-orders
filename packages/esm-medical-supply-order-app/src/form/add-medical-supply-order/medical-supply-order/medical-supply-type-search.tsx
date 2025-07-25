import React, { useCallback, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSkeleton, Search, SkeletonText, Tile } from '@carbon/react';
import { ArrowRight, ShoppingCartArrowDown, ShoppingCartArrowUp } from '@carbon/react/icons';
import {
  useDebounce,
  useLayoutType,
  useSession,
  ResponsiveWrapper,
  closeWorkspace,
  launchWorkspace,
} from '@openmrs/esm-framework';
import { useOrderBasket } from '@openmrs/esm-patient-common-lib';
import styles from './medical-supply-type-search.scss';
import { type MedicalSupplyOrderBasketItem } from '../../../types';
import { createEmptyMedicalSupplyOrder } from './medical-supply-order';
import { type MedicalSupplyType } from '../../../hooks/useMedicalSupplyTypes';
import { prepMedicalSupplyOrderPostData } from '../api';
import { useMedicalSupplySearch } from './medical-supply-order.resource';

export interface MedicalSupplyTypeSearchProps {
  openMedicalSupplyForm: (searchResult: MedicalSupplyOrderBasketItem) => void;
}

export function MedicalSupplyTypeSearch({ openMedicalSupplyForm }: MedicalSupplyTypeSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const searchInputRef = useRef(null);

  const focusAndClearSearchInput = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value ?? '');
  };

  return (
    <>
      <ResponsiveWrapper>
        <Search
          autoFocus
          size="lg"
          placeholder={t('searchFieldPlaceholder', 'Search for a medical supply')}
          labelText={t('searchFieldPlaceholder', 'Search for a medical supply')}
          onChange={handleSearchTermChange}
          ref={searchInputRef}
          value={searchTerm}
        />
      </ResponsiveWrapper>
      <MedicalSupplyTypeSearchResults
        searchTerm={debouncedSearchTerm}
        openOrderForm={openMedicalSupplyForm}
        focusAndClearSearchInput={focusAndClearSearchInput}
      />
    </>
  );
}

interface MedicalSupplyTypeSearchResultsProps {
  searchTerm: string;
  openOrderForm: (searchResult: MedicalSupplyOrderBasketItem) => void;
  focusAndClearSearchInput: () => void;
}

function MedicalSupplyTypeSearchResults({
  searchTerm,
  openOrderForm,
  focusAndClearSearchInput,
}: MedicalSupplyTypeSearchResultsProps) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { searchResults, isLoading, error } = useMedicalSupplySearch(searchTerm, 'Medical supply');
  if (!searchTerm) {
    return <div className={styles.container}></div>;
  }

  if (isLoading) {
    return <MedicalSupplyTypeSearchSkeleton />;
  }

  if (error) {
    return (
      <Tile className={styles.emptyState}>
        <div>
          <h4 className={styles.productiveHeading01}>
            {t('errorFetchingTestTypes', 'Error fetching results for "{{searchTerm}}"', {
              searchTerm,
            })}
          </h4>
          <p className={styles.bodyShort01}>
            <span>{t('trySearchingAgain', 'Please try searching again')}</span>
          </p>
        </div>
      </Tile>
    );
  }

  return (
    <>
      {searchResults?.length ? (
        <div className={styles.container}>
          {searchTerm && (
            <div className={styles.orderBasketSearchResultsHeader}>
              <span className={styles.searchResultsCount}>
                {t('searchResultsMatchesForTerm', '{{count}} results for "{{searchTerm}}"', {
                  count: searchResults?.length,
                  searchTerm,
                })}
              </span>
              <Button kind="ghost" onClick={focusAndClearSearchInput} size={isTablet ? 'md' : 'sm'}>
                {t('clearSearchResults', 'Clear Results')}
              </Button>
            </div>
          )}
          <div className={styles.resultsContainer}>
            {searchResults.map((testType) => (
              <MedicalSupplyTypeSearchResultItem
                key={testType.conceptUuid}
                testType={testType}
                openOrderForm={openOrderForm}
              />
            ))}
          </div>
        </div>
      ) : (
        <Tile className={styles.emptyState}>
          <div>
            <h4 className={styles.productiveHeading01}>
              {t('noResultsForTestTypeSearch', 'No results to display for "{{searchTerm}}"', {
                searchTerm,
              })}
            </h4>
            <p className={styles.bodyShort01}>
              <span>{t('tryTo', 'Try to')}</span>{' '}
              <span className={styles.link} role="link" tabIndex={0} onClick={focusAndClearSearchInput}>
                {t('searchAgain', 'search again')}
              </span>{' '}
              <span>{t('usingADifferentTerm', 'using a different term')}</span>
            </p>
          </div>
        </Tile>
      )}
      <hr className={classNames(styles.divider, isTablet ? styles.tabletDivider : styles.desktopDivider)} />
    </>
  );
}

interface MedicalSupplyTypeSearchResultItemProps {
  testType: MedicalSupplyType;
  openOrderForm: (searchResult: MedicalSupplyOrderBasketItem) => void;
}

const MedicalSupplyTypeSearchResultItem: React.FC<MedicalSupplyTypeSearchResultItemProps> = ({
  testType,
  openOrderForm,
}) => {
  const isTablet = useLayoutType() === 'tablet';
  const session = useSession();
  const { orders, setOrders } = useOrderBasket<MedicalSupplyOrderBasketItem>(
    'medicalsupply',
    prepMedicalSupplyOrderPostData,
  );
  const testTypeAlreadyInBasket = useMemo(
    () => orders?.some((order) => order.testType.conceptUuid === testType.conceptUuid),
    [orders, testType],
  );

  const createMedicalSupplyOrder = useCallback(
    (testType: MedicalSupplyType) => {
      return createEmptyMedicalSupplyOrder(testType, session.currentProvider.uuid);
    },
    [session.currentProvider?.uuid],
  );

  const { t } = useTranslation();

  const addToBasket = useCallback(() => {
    const medicalSupplyOrder = createMedicalSupplyOrder(testType);
    medicalSupplyOrder.isOrderIncomplete = true;
    setOrders([...orders, medicalSupplyOrder]);
    closeWorkspace('add-medical-supply-order', {
      ignoreChanges: true,
      onWorkspaceClose: () => launchWorkspace('order-basket'),
    });
  }, [orders, setOrders, createMedicalSupplyOrder, testType]);

  const removeFromBasket = useCallback(() => {
    setOrders(orders.filter((order) => order.testType.conceptUuid !== testType.conceptUuid));
  }, [orders, setOrders, testType.conceptUuid]);

  return (
    <Tile
      className={classNames(styles.searchResultTile, {
        [styles.tabletSearchResultTile]: isTablet,
      })}
      key={testType.conceptUuid}
      role="listitem">
      <div className={classNames(styles.searchResultTileContent, styles.text02)}>
        <p>
          <span className={styles.productiveHeading01}>{testType.label}</span>{' '}
        </p>
      </div>
      <div className={styles.searchResultActions}>
        {testTypeAlreadyInBasket ? (
          <Button
            kind="danger--ghost"
            renderIcon={(props) => <ShoppingCartArrowUp size={16} {...props} />}
            onClick={() => removeFromBasket()}>
            {t('removeFromBasket', 'Remove from basket')}
          </Button>
        ) : (
          <Button
            kind="ghost"
            renderIcon={(props) => <ShoppingCartArrowDown size={16} {...props} />}
            onClick={() => addToBasket()}>
            {t('directlyAddToBasket', 'Add to basket')}
          </Button>
        )}
        <Button
          kind="ghost"
          renderIcon={(props) => <ArrowRight size={16} {...props} />}
          onClick={() => openOrderForm(createMedicalSupplyOrder(testType))}>
          {t('goToDrugOrderForm', 'Order form')}
        </Button>
      </div>
    </Tile>
  );
};

const MedicalSupplyTypeSearchSkeleton = () => {
  const isTablet = useLayoutType() === 'tablet';
  const tileClassName = `${isTablet ? `${styles.tabletSearchResultTile}` : `${styles.desktopSearchResultTile}`} ${
    styles.skeletonTile
  }`;
  return (
    <div className={styles.searchResultSkeletonWrapper}>
      <div className={styles.orderBasketSearchResultsHeader}>
        <SkeletonText className={styles.searchResultCntSkeleton} />
        <ButtonSkeleton size={isTablet ? 'md' : 'sm'} />
      </div>
      <Tile className={tileClassName}>
        <SkeletonText />
      </Tile>
      <Tile className={tileClassName}>
        <SkeletonText />
      </Tile>
      <Tile className={tileClassName}>
        <SkeletonText />
      </Tile>
      <Tile className={tileClassName}>
        <SkeletonText />
      </Tile>
      <hr className={classNames(styles.divider, isTablet ? styles.tabletDivider : styles.desktopDivider)} />
    </div>
  );
};
