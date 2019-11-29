import Vue from 'vue'
import { assignPropertyDescriptors, asTruthyArray, reactiveEnsurePath } from '../utils'
import { normalize } from './normalize'

const defaultConfig = {
  getRequestId: ({ method, url }) => `${method}:${url}`,
  getRecordId: ({ type, id }) => `${type}:${id}`,
}

class Cache {
  constructor (config = {}) {
    this.options = { ...defaultConfig, ...config }
    this.actionIndex = 0

    this.state = Vue.observable({
      records: {},
      requests: {},
    })
  }

  get getRecordId () {
    return this.options.getRecordId
  }

  get getRequestId () {
    return this.options.getRequestId
  }

  initRequest (config) {
    const requestId = this.getRequestId(config)
    reactiveEnsurePath(this.state.requests, [requestId], Object.freeze({
      requestId,
      data: () => null,
    }))
  }

  writeRequestData (config, dataGetter, raw) {
    const requestId = this.getRequestId(config)
    this.state.requests[requestId] = Object.freeze({
      ...this.state.requests[requestId],
      timestamp: +new Date(),
      data: dataGetter,
      raw,
    })
    return this.state.requests[requestId]
  }

  readRequest (requestId) {
    const request = this.state.requests[requestId]
    return request && {
      ...request,
      get data () { return request.data() },
    }
  }

  read (record) {
    return this.state.records[this.getRecordId(record)]
  }

  parseResponse (config, response) {
    if (
      (config.method === 'get' && response.status === 200) ||
      (config.method === 'post' && [200, 201].includes(response.status)) ||
      (config.method === 'patch' && [200, 201, 204].includes(response.status))
    ) {
      const dataFromRequest = ['post', 'patch'].includes(config.method) && response.status === 204
      const data = dataFromRequest ? config.data : response.data.data
      const included = response.data.included
      const records = this.collectRecords(data)
      const includedRecords = asTruthyArray(data).concat(included || [])
      const includedRecordsIds = includedRecords.map(this.getRecordId)

      const mutations = Array.from(records)
        .map(recordId => ctx => reactiveEnsurePath(ctx.state.records, [recordId], null))
        .concat(includedRecordsIds.map(recordId => ctx => reactiveEnsurePath(ctx.state.records, [recordId], {})))
        .concat(includedRecords.map(rec => ctx => {
          const recordId = this.getRecordId(rec)
          const extendedNormalizedRec = assignPropertyDescriptors({}, ctx.state.records[recordId], normalize(ctx, rec))
          ctx.state.records[recordId] = Object.freeze(extendedNormalizedRec)
        }))

      let getter = null

      const createGetter = (ctx) => () => Array.isArray(data) ? data.map(ctx.read.bind(ctx)) : ctx.read(data)

      return {
        persist: () => {
          mutations.forEach(commit => commit(this))
          getter = createGetter(this)
        },
        getData: () => {
          if (getter) return getter()
          const state = { records: [] }
          const read = record => state.records[this.getRecordId(record)]
          const temporaryContext = { state, read }
          mutations.forEach(commit => commit(temporaryContext))
          getter = createGetter(temporaryContext)
          return getter()
        },
      }
    }
    return {
      persist: () => {},
      getData: () => response,
    }
  }

  collectRecords (data, records = new Set()) {
    if (data) {
      asTruthyArray(data).map(this.getRecordId).forEach(id => records.add(id))
      asTruthyArray(data).forEach(record => {
        const relationships = record.relationships || {}
        Object.keys(relationships).forEach(rel => this.collectRecords(relationships[rel].data, records))
      })
    }
    return records
  }
}

export default Cache
