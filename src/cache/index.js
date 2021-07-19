import { reactive } from 'vue'
import { assignPropertyDescriptors, asTruthyArray, reactiveEnsurePath, mapOrCall } from '../utils'
import { assignMetaDescriptor, mergedMeta, normalize, normalizeRelationships, reverseIdentification } from './normalize'
import NormalizedDataProxy from './normalized-data-proxy'

const getUniqueCallId = (() => {
  let callId = 0
  return () => callId++
})()

const defaultConfig = {
  getRequestId: ({ method, url }) => `${method}:${url}`,
  getRecordId: ({ __type, type, id }) => `${__type || type}:${id}`,
}

class Cache {
  constructor (config = {}) {
    this.options = { ...defaultConfig, ...config }
    this.actionIndex = 0

    this.state = reactive({
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
    const request = this.state.requests[requestId]
    const callId = getUniqueCallId()
    if (request) {
      this.state.requests[requestId] = Object.freeze({ ...request, callId })
    }
    reactiveEnsurePath(this.state.requests, [requestId], Object.freeze({
      callId,
      requestId,
      identification: undefined,
    }))
    return callId
  }

  initNextPageRequest (requestId) {
    const request = this.state.requests[requestId]
    const callId = getUniqueCallId()
    if (request) {
      this.state.requests[requestId] = Object.freeze({ ...request, callId })
    }
    return callId
  }

  writeRequestResponse (config, callId, identification, raw) {
    const requestId = this.getRequestId(config)
    const request = this.state.requests[requestId]
    if (request.callId === callId) {
      this.state.requests[requestId] = Object.freeze({
        ...request,
        identification,
        raw,
      })
    }
    return this.state.requests[requestId]
  }

  writeNextPageRequestResponse (requestId, callId, identification, raw) {
    const prevIdentification = this.state.requests[requestId].identification || []
    const request = this.state.requests[requestId]
    if (request && request.callId === callId) {
      this.state.requests[requestId] = Object.freeze({
        ...request,
        identification: prevIdentification.concat(identification),
        raw,
      })
    }
    return this.state.requests[requestId]
  }

  writeRequestData (config, data) {
    const requestId = this.getRequestId(config)
    const request = this.state.requests[requestId]
    if (request) {
      this.state.requests[requestId] = Object.freeze({
        ...request,
        identification: reverseIdentification(data),
      })
    }
    return request
  }

  readRequestData (config) {
    const requestId = this.getRequestId(config)
    const request = this.state.requests[requestId]
    return request && this.read(request.identification)
  }

  readRequest (requestId) {
    const request = this.state.requests[requestId]
    const theCache = this
    return request && {
      ...request,
      get data () {
        return theCache.read(request.identification)
      },
    }
  }

  read (data) {
    return mapOrCall(data, record => record && this.state.records[this.getRecordId(record)])
  }

  write (record, ignoreRelated) {
    const recordId = this.getRecordId(record)
    reactiveEnsurePath(this.state.records, [recordId], null)
    const cachedRecord = this.state.records[recordId]
    const normalizedRecord = normalizeRelationships(this, record, ignoreRelated)
    const base = assignMetaDescriptor({}, mergedMeta(cachedRecord, record))
    const extendedNormalizedRec = assignPropertyDescriptors(base, cachedRecord, normalizedRecord)
    this.state.records[recordId] = Object.freeze(extendedNormalizedRec)
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
      const recordsSet = this.collectRecords(data)
      const includedRecords = asTruthyArray(data).concat(included || [])
      const includedRecordsIds = includedRecords.map(this.getRecordId)

      const mutations = Object.keys(recordsSet)
        .map(recordId => ctx => reactiveEnsurePath(ctx.state.records, [recordId], null))
        .concat(includedRecordsIds.map(recordId => ctx => reactiveEnsurePath(ctx.state.records, [recordId], {})))
        .concat(includedRecords.map(rec => ctx => ctx.write(normalize(ctx, rec), true)))

      return new NormalizedDataProxy(this, { data, mutations })
    }
    return new NormalizedDataProxy(this)
  }

  collectRecords (data, recordsSet = {}) {
    if (data) {
      asTruthyArray(data).map(this.getRecordId).forEach(id => recordsSet[id] = true)
      asTruthyArray(data).forEach(record => {
        const relationships = record.relationships || {}
        Object.keys(relationships).forEach(rel => this.collectRecords(relationships[rel].data, recordsSet))
      })
    }
    return recordsSet
  }
}

export default Cache
