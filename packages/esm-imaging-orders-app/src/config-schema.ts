import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  radiologyConceptSetUuid: {
    _type: Type.String,
    _description: 'Radiology Concept SET UUID',
    _default: '164068AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  radiologyConceptClassUuid: {
    _type: Type.String,
    _description: 'Radiology Concept Class UUID',
    _default: '8caa332c-efe4-4025-8b18-3398328e1323',
  },
  orders: {
    radiologyOrderTypeUuid: {
      _type: Type.UUID,
      _description: "UUID for the 'Radiology' order type",
      _default: 'b4a7c280-369e-4d12-9ce8-18e36783fed6',
    },
    labOrderTypeUuid: {
      _type: Type.UUID,
      _description: "UUID for the 'Lab' order type",
      _default: '52a447d3-a64a-11e3-9aeb-50e549534c5e',
    },
    labOrderableConcepts: {
      _type: Type.Array,
      _description:
        'UUIDs of concepts that represent orderable lab tests or lab sets. If an empty array `[]` is provided, every concept with class `Test` will be considered orderable.',
      _elements: {
        _type: Type.UUID,
      },
      _default: [],
    },
  },
};

interface OrderReason {
  labTestUuid: string;
  required: boolean;
  orderReasons: Array<string>;
}
export type ImagingConfig = {
  radiologyConceptSetUuid: string;
  orders: {
    labOrderTypeUuid: string;
    labOrderableConcepts: Array<string>;
    radiologyOrderTypeUuid: string;
  };
  labTestsWithOrderReasons: Array<OrderReason>;
  radiologyConceptClassUuid: string;
};
