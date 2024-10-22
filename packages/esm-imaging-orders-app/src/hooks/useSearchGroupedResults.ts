import { useMemo } from 'react';
import { GroupedOrders } from '../shared/ui/common/grouped-imaging-types';

/**
 * A custom hook that filters grouped orders based on a search string.
 *
 * @param {Array<GroupedOrders>} data - An array of grouped orders to be filtered.
 * @param {string} searchString - The string to search for within the orders.
 * @returns {Array<GroupedOrders>} - The filtered array of grouped orders.
 */
export function useSearchGroupedResults(data: Array<GroupedOrders>, searchString: string) {
  return useMemo(() => {
    const trimmedSearchString = searchString.trim().toLowerCase();

    if (!trimmedSearchString) {
      return data;
    }

    return data.filter((orderGroup) =>
      orderGroup.orders.some(
        (order) =>
          order.orderNumber.toLowerCase().includes(trimmedSearchString) ||
          order.patient.display.toLowerCase().includes(trimmedSearchString),
      ),
    );
  }, [searchString, data]);
}
