import { formatDate, parseDate } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import { Result } from '../imaging-tabs/work-list/work-list.resource';

/**
 * A custom hook that processes and filters imaging order results based on a search string.
 *
 * @param {Result[]} data - An array of imaging order results to be processed and searched.
 * @param {string} searchString - The string to search for within the data.
 * @returns {Array} An array of processed and filtered imaging order results.
 */
export function useSearchResults(data: Result[], searchString: string) {
  /**
   * Flattens and transforms the input data for easier searching and display.
   */
  const flattenedData = data.map((eachObject) => {
    return {
      ...eachObject,
      id: eachObject.uuid,
      date: formatDate(parseDate(eachObject.dateActivated)),
      patient: eachObject.patient.display.split('-')[1],
      orderNumber: eachObject.orderNumber,
      procedure: eachObject.concept.display,
      action: eachObject.action,
      status: eachObject.fulfillerStatus ?? '--',
      orderer: eachObject.orderer.display,
      urgency: eachObject.urgency,
    };
  });

  /**
   * Memoized search results based on the flattened data and search string.
   */
  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      const search = searchString.toLowerCase();
      return flattenedData.filter((eachDataRow) =>
        Object.entries(eachDataRow).some(([header, value]) => {
          if (header === 'patientUuid') {
            return false;
          }
          return `${value}`.toLowerCase().includes(search);
        }),
      );
    }

    return flattenedData;
  }, [searchString, flattenedData]);

  return searchResults;
}
