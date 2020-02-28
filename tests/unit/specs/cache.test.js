import Cache from '../../../src/cache'
import {
  RECORD_WITH_RELATIONSHIPS,
  RECORD_WITH_RELATIONSHIPS_RELATIONS,
  RECORD_WITH_RELATIONSHIPS_NORMALIZED,
  RECORD_WITH_RELATIONSHIPS_UPDATED,
  RECORD_WITH_RELATIONSHIPS_UPDATED_NORMALIZED,
  SIMPLE_RECORD,
} from '../fixtures/records'
import { SIMPLE_REQUEST } from '../fixtures/requests'
import { normalize } from '../../../src/cache/normalize'

describe('Cache', () => {
  it('has default implementation of `getRecordId` method', () => {
    const cache = new Cache()
    expect(cache.getRecordId(SIMPLE_RECORD)).toBe('SIMPLE_RECORD_TYPE:SIMPLE_RECORD_ID')
  })

  it('uses provided `getRecordId` method', () => {
    const getRecordId = () => 'test'
    const cache = new Cache({ getRecordId })
    expect(cache.getRecordId(SIMPLE_RECORD)).toBe('test')
  })

  it('has default implementation of `getRequestId` method', () => {
    const cache = new Cache()
    expect(cache.getRequestId(SIMPLE_REQUEST)).toBe('get:SIMPLE_REQUEST_URL')
  })

  it('uses provided `getRequestId` method', () => {
    const getRequestId = () => 'test'
    const cache = new Cache({ getRequestId })
    expect(cache.getRequestId(SIMPLE_REQUEST)).toBe('test')
  })

  describe('reading and writing', () => {
    describe('when cache is empty', () => {
      let cache

      beforeEach(() => {
        cache = new Cache()
      })

      it('works for empty cache and simple record', () => {
        cache.write(normalize(cache, SIMPLE_RECORD))
        expect(cache.read(SIMPLE_RECORD)).toMatchObject({
          __type: 'SIMPLE_RECORD_TYPE',
          id: 'SIMPLE_RECORD_ID',
          a: 'SIMPLE_RECORD_ATTR_A',
          b: 'SIMPLE_RECORD_ATTR_B',
        })
      })

      it('works for empty cache and record with relationships', () => {
        cache.write(normalize(cache, RECORD_WITH_RELATIONSHIPS))
        expect(cache.read(RECORD_WITH_RELATIONSHIPS)).toMatchObject({
          __type: 'RECORD_WITH_RELATIONSHIPS_TYPE',
          id: 'RECORD_WITH_RELATIONSHIPS_ID',
          a: 'RECORD_WITH_RELATIONSHIPS_ATTR_A',
          b: 'RECORD_WITH_RELATIONSHIPS_ATTR_B',
          RECORD_WITH_RELATIONSHIPS_REL_NULL: null,
          RECORD_WITH_RELATIONSHIPS_REL_SINGLE: undefined,
          RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE: [undefined, undefined],
        })
      })

      it('relationships are updated after loaded', () => {
        cache.write(normalize(cache, RECORD_WITH_RELATIONSHIPS))
        RECORD_WITH_RELATIONSHIPS_RELATIONS.forEach(record => cache.write(normalize(cache, record)))
        expect(cache.read(RECORD_WITH_RELATIONSHIPS)).toMatchObject(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
      })
    })

    describe('when cache already contains relations', () => {
      let cache

      beforeEach(() => {
        cache = new Cache()
        RECORD_WITH_RELATIONSHIPS_RELATIONS.forEach(record => cache.write(normalize(cache, record)))
      })

      it('shows cached relationships for record with relationships', () => {
        cache.write(normalize(cache, RECORD_WITH_RELATIONSHIPS))
        expect(cache.read(RECORD_WITH_RELATIONSHIPS)).toMatchObject(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
      })
    })

    describe('when cache already contains record', () => {
      let cache

      beforeEach(() => {
        cache = new Cache()
        cache.write(normalize(cache, RECORD_WITH_RELATIONSHIPS))
        RECORD_WITH_RELATIONSHIPS_RELATIONS.forEach(record => cache.write(normalize(cache, record)))
      })

      it('it overwrites attributes and relationships properly', () => {
        cache.write(normalize(cache, RECORD_WITH_RELATIONSHIPS_UPDATED))
        expect(cache.read(RECORD_WITH_RELATIONSHIPS_UPDATED)).toMatchObject(RECORD_WITH_RELATIONSHIPS_UPDATED_NORMALIZED)
      })
    })

    describe('when record has nested resources', () => {
      let cache

      beforeEach(() => {
        cache = new Cache()
      })

      it('shows record with nested resources', () => {
        cache.write(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
        expect(cache.read(RECORD_WITH_RELATIONSHIPS_NORMALIZED)).toMatchObject(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
      })

      it('shows record without nested resources if ignoreRelated is on', () => {
        cache.write(RECORD_WITH_RELATIONSHIPS_NORMALIZED, true)
        expect(cache.read(RECORD_WITH_RELATIONSHIPS_NORMALIZED)).toMatchObject({
          __type: 'RECORD_WITH_RELATIONSHIPS_TYPE',
          id: 'RECORD_WITH_RELATIONSHIPS_ID',
          a: 'RECORD_WITH_RELATIONSHIPS_ATTR_A',
          b: 'RECORD_WITH_RELATIONSHIPS_ATTR_B',
          RECORD_WITH_RELATIONSHIPS_REL_NULL: null,
        })
      })

      it('shows nested resource', () => {
        cache.write(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
        expect(cache.read({ type: 'SINGLE_TYPE', id: 'SINGLE_ID' })).toMatchObject({
          __type: 'SINGLE_TYPE',
          id: 'SINGLE_ID',
          SINGLE_TEST: 'test',
        })
        expect(cache.read({ type: 'ITEM_1_TYPE', id: 'ITEM_1_ID' })).toMatchObject({
          __type: 'ITEM_1_TYPE',
          id: 'ITEM_1_ID',
          ITEM_1_TEST: 'test',
        })
        expect(cache.read({ type: 'ITEM_2_TYPE', id: 'ITEM_2_ID' })).toMatchObject({
          __type: 'ITEM_2_TYPE',
          id: 'ITEM_2_ID',
          ITEM_2_TEST: 'test',
        })
      })

      it('nested resources are updating', () => {
        cache.write(RECORD_WITH_RELATIONSHIPS_NORMALIZED)
        cache.write({ __type: 'SINGLE_TYPE', id: 'SINGLE_ID', SINGLE_TEST: 'test-updated' })
        cache.write({ __type: 'ITEM_1_TYPE', id: 'ITEM_1_ID', ITEM_1_TEST: 'test-updated' })

        expect(cache.read(RECORD_WITH_RELATIONSHIPS_NORMALIZED)).toMatchObject({
          ...RECORD_WITH_RELATIONSHIPS_NORMALIZED,
          RECORD_WITH_RELATIONSHIPS_REL_SINGLE: {
            __type: 'SINGLE_TYPE',
            id: 'SINGLE_ID',
            SINGLE_TEST: 'test-updated',
          },
          RECORD_WITH_RELATIONSHIPS_REL_MULTIPLE: [
            {
              __type: 'ITEM_1_TYPE',
              id: 'ITEM_1_ID',
              ITEM_1_TEST: 'test-updated',
            },
            {
              __type: 'ITEM_2_TYPE',
              id: 'ITEM_2_ID',
              ITEM_2_TEST: 'test',
            },
          ],
        })
      })
    })
  })
})
