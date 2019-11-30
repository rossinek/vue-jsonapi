export const SIMPLE_RECORD = {
  id: 'SIMPLE_RECORD_ID',
  type: 'SIMPLE_RECORD_TYPE',
  attributes: {
    a: 'SIMPLE_RECORD_ATTR_A',
    b: 'SIMPLE_RECORD_ATTR_B',
  },
}

export const RECORD_WITH_RELATIONSHIPS = {
  id: 'RECORD_WITH_RELATIONSHIPS_ID',
  type: 'RECORD_WITH_RELATIONSHIPS_TYPE',
  attributes: {
    a: 'RECORD_WITH_RELATIONSHIPS_ATTR_A',
    b: 'RECORD_WITH_RELATIONSHIPS_ATTR_B',
  },
  relationships: {
    RECORD_WITH_RELATIONSHIPS_REL_NULL: {
      data: null,
    },
    RECORD_WITH_RELATIONSHIPS_REL_SINGLE: {
      data: {
        id: 'SINGLE_ID',
        type: 'SINGLE_TYPE',
      },
    },
    RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE: {
      data: [{
        id: 'ITEM_1_ID',
        type: 'ITEM_1_TYPE',
      }, {
        id: 'ITEM_2_ID',
        type: 'ITEM_2_TYPE',
      }],
    },
  },
}
