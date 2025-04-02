import { useMemo } from 'react';
import { type GroupedOrders } from '../types';

export function useSearchGroupedResults(data: Array<GroupedOrders>, searchString: string) {
  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      // Normalize the search string to lowercase
      const lowerSearchString = searchString.toLowerCase();
      return data.filter((orderGroup) =>
        orderGroup.orders.some(
          (order) =>
            order.orderNumber.toLowerCase().includes(lowerSearchString) ||
            order.patient.display.toLowerCase().includes(lowerSearchString),
        ),
      );
    }

    return data;
  }, [searchString, data]);

  return searchResults;
}
