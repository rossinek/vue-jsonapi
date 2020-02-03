import { identification } from './normalize'
import { mapOrCall } from '../utils'

class NormalizedDataProxy {
  constructor (cache, { data, mutations } = {}) {
    this._cache = cache
    this._mutations = mutations || []
    this._identification = identification(data)
    this._context = null
    this._persisted = false

    this.persist = this.persist.bind(this)
    this.getData = this.getData.bind(this)
  }

  get identification () {
    return this._identification
  }

  get context () {
    if (!this._context) {
      const state = { records: [] }
      const read = record => state.records[this._cache.getRecordId(record)]
      const write = (record, data) => { state.records[this._cache.getRecordId(record)] = data }
      this._context = { state, read, write }
      this._mutations.forEach(commit => commit(this._context))
    }
    return this._context
  }

  persist () {
    if (!this._persisted) {
      this._mutations.forEach(commit => commit(this._cache))
      this._context = this._cache
      this._persisted = true
    }
  }

  getData () {
    return mapOrCall(this._identification, this.context.read.bind(this.context))
  }
}

export default NormalizedDataProxy
