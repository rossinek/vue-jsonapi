import Cache from '../../../src/cache/index'

const RECORD = { type: 'model', id: 'uniqueid' }
const REQUEST = { method: 'get', url: '/test' }

describe('Cache', () => {
  it('has default implementation of `getRecordId` method', () => {
    const cache = new Cache()
    expect(cache.getRecordId(RECORD)).toBe('model:uniqueid')
  })

  it('uses provided `getRecordId` method', () => {
    const getRecordId = () => 'test'
    const cache = new Cache({ getRecordId })
    expect(cache.getRecordId(RECORD)).toBe('test')
  })

  it('has default implementation of `getRequestId` method', () => {
    const cache = new Cache()
    expect(cache.getRequestId(REQUEST)).toBe('get:/test')
  })

  it('uses provided `getRequestId` method', () => {
    const getRequestId = () => 'test'
    const cache = new Cache({ getRequestId })
    expect(cache.getRequestId(REQUEST)).toBe('test')
  })
})
