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
    RECORD_WITH_RELATIONSHIPS_REL_NULL: 'attribute with relationship name',
    RECORD_WITH_RELATIONSHIPS_REL_SINGLE: 'attribute with relationship name',
    RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE: 'attribute with relationship name',
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

export const RECORD_WITH_RELATIONSHIPS_UPDATED = {
  id: 'RECORD_WITH_RELATIONSHIPS_ID',
  type: 'RECORD_WITH_RELATIONSHIPS_TYPE',
  attributes: {
    b: 'RECORD_WITH_RELATIONSHIPS_ATTR_B_UPDATED',
    c: 'RECORD_WITH_RELATIONSHIPS_ATTR_C_UPDATED',
    RECORD_WITH_RELATIONSHIPS_REL_NULL: 'attribute with relationship name (updated)',
    RECORD_WITH_RELATIONSHIPS_REL_SINGLE: 'attribute with relationship name (updated)',
    RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE: 'attribute with relationship name (updated)',
  },
  relationships: {
    RECORD_WITH_RELATIONSHIPS_REL_NULL: {
      data: {
        id: 'SINGLE_ID',
        type: 'SINGLE_TYPE',
      },
    },
    RECORD_WITH_RELATIONSHIPS_REL_SINGLE: {
      data: null,
    },
  },
}

export const RECORD_WITH_RELATIONSHIPS_RELATIONS = [
  {
    id: 'SINGLE_ID',
    type: 'SINGLE_TYPE',
    attributes: {
      SINGLE_TEST: 'test',
    },
  },
  {
    id: 'ITEM_1_ID',
    type: 'ITEM_1_TYPE',
    attributes: {
      ITEM_1_TEST: 'test',
    },
  },
  {
    id: 'ITEM_2_ID',
    type: 'ITEM_2_TYPE',
    attributes: {
      ITEM_2_TEST: 'test',
    },
  },
]
