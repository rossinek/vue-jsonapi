import Cache from '../../src/cache/index'
import { SIMPLE_RECORD } from './fixtures/records'
import { SIMPLE_REQUEST } from './fixtures/requests'

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
})
