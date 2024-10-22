import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  medicalSupplyQuantityUnitsConceptSetUuid: {
    _type: Type.String,
    _description: 'Medical Supply Quantity Units Concept SET UUID',
    _default: '162402AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  orders: {
    medicalSupplyOrderTypeUuid: {
      _type: Type.UUID,
      _description: "UUID for the 'Medical Supply' order type",
      _default: 'dab3ab30-2feb-48ec-b4af-8332a0831b49',
    },
    medicalSupplyOrderableConcepts: {
      _type: Type.Array,
      _description:
        'UUIDs of concepts that represent orderable medical supply. If an empty array `[]` is provided, every concept with class `Medical supply` will be considered orderable.',
      _elements: {
        _type: Type.UUID,
      },
      _default: [],
    },
  },
};

interface OrderReason {
  medicalSupplyUuid: string;
  required: boolean;
  orderReasons: Array<string>;
}
export type MedicalSupplyConfig = {
  medicalSupplyQuantityUnitsConceptSetUuid: string;
  orders: {
    medicalSupplyOrderableConcepts: Array<string>;
    medicalSupplyOrderTypeUuid: string;
  };
  medicalSupplyWithOrderReasons: Array<OrderReason>;
};
