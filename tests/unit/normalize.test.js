import { normalize } from '../../src/cache/normalize'
import { RECORD_WITH_RELATIONSHIPS, SIMPLE_RECORD } from './fixtures/records'

describe('#normalize', () => {
  describe('when record has no relationships', () => {
    let output

    beforeEach(() => {
      output = normalize({}, SIMPLE_RECORD)
    })

    it('merges id with attributes', () => {
      expect(output).toMatchObject({
        id: 'SIMPLE_RECORD_ID',
        a: 'SIMPLE_RECORD_ATTR_A',
        b: 'SIMPLE_RECORD_ATTR_B',
      })
    })

    it('adds `__type` field equal to record type', () => {
      expect(output.__type).toBe('SIMPLE_RECORD_TYPE')
    })
  })

  describe('when record has relationships', () => {
    let output
    let context

    beforeEach(() => {
      context = { read: ({ id }) => id }
      output = normalize(context, RECORD_WITH_RELATIONSHIPS)
    })

    it('adds null field for empty `to-one` relation', () => {
      expect(output.RECORD_WITH_RELATIONSHIPS_REL_NULL).toBeNull()
    })

    it('adds field for `to-one` relation with value from context', () => {
      expect(output.RECORD_WITH_RELATIONSHIPS_REL_SINGLE).toEqual('SINGLE_ID')
    })

    it('adds field for `to-many` relation with mapped value from context', () => {
      expect(output.RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE).toEqual(['ITEM_1_ID', 'ITEM_2_ID'])
    })

    describe('when context changes after normalization', () => {
      beforeEach(() => {
        context.read = ({ id }) => `UPDATED_${id}`
      })

      it('field for `to-one` relation has updated value from context', () => {
        expect(output.RECORD_WITH_RELATIONSHIPS_REL_SINGLE).toEqual('UPDATED_SINGLE_ID')
      })

      it('field for `to-many` relation has mapped updated value from context', () => {
        expect(output.RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE).toEqual(['UPDATED_ITEM_1_ID', 'UPDATED_ITEM_2_ID'])
      })
    })
  })
})
