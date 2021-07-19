import { reactive, watch } from 'vue'
import { isEqual, pick } from './utils'

export const POLICY_NETWORK_ONLY = 'network-only'
export const POLICY_CACHE_AND_NETWORK = 'cache-and-network'
export const POLICY_CACHE_FIRST = 'cache-first'
export const POLICY_CACHE_ONLY = 'cache-only'
export const POLICY_NO_CACHE = 'no-cache'

export const STATUS_IDLE = 'idle'
export const STATUS_PENDING = 'pending'
export const STATUS_SUCCESS = 'success'
export const STATUS_ERROR = 'error'

const defaultOptions = {
  config: () => { throw Error('No config specified!') },
  fetchPolicy: POLICY_NETWORK_ONLY,
}

class SmartQuery {
  constructor (vm, name, options = {}) {
    this.name = name
    this.rawOptions = { ...defaultOptions, ...options }
    this.vm = vm
    this.watchers = []
    this.interval = null

    this.observable = reactive({
      info: {},
    })

    this.init()
    this.run()
  }

  get $jsonapi () {
    return this.vm.$jsonapi
  }

  get loading () {
    return this.observable.info.status === STATUS_PENDING
  }

  get status () {
    return this.observable.info.status
  }

  get info () {
    return this.observable.info
  }

  set info (info) {
    return this.observable.info = info
  }

  set data (data) {
    if (data) {
      const updated = this.rawOptions.update ? this.rawOptions.update.call(this.vm, data, this.request) : data
      if (!Object.prototype.hasOwnProperty.call(this.vm.$data, this.name)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Default value for jsonapi query is not specified in component\'s `data` object.')
        }
        return
      }
      this.vm[this.name] = updated
    }
  }

  get request () {
    return this.readCachedRequest()
  }

  get hasMore () {
    return !!(this.request.raw && this.request.raw.data.links && this.request.raw.data.links.next)
  }

  get pollInterval () {
    return this.rawOptions.pollInterval
  }

  init () {
    this.watchers.push(
      watch(this.computeOptions.bind(this), this.onComputeOptionsChange.bind(this)),
      watch(this.readCachedRequest.bind(this), this.onRequestDataChange.bind(this), { deep: true }),
    )
    if (this.pollInterval) {
      this.interval = setInterval(this.refetch.bind(this), this.pollInterval)
    }
  }

  destroy () {
    this.watchers.forEach(unwatch => unwatch())
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  async run (computedOptions = this.computeOptions()) {
    const { skip, config, fetchPolicy } = computedOptions

    if (skip) return

    const info = this.createRequestInfo(config)
    this.info = info

    let cacheValue
    if ([POLICY_CACHE_AND_NETWORK, POLICY_CACHE_FIRST, POLICY_CACHE_ONLY].includes(fetchPolicy)) {
      cacheValue = this.fetchFromCache()
    }

    if (
      [POLICY_CACHE_AND_NETWORK, POLICY_NETWORK_ONLY, POLICY_NO_CACHE].includes(fetchPolicy) ||
      (fetchPolicy === POLICY_CACHE_FIRST && !cacheValue)
    ) {
      const noCache = fetchPolicy === POLICY_NO_CACHE
      const response = await this.fetch({ config, noCache }, info)
      if (noCache) {
        this.onRequestDataChange(response)
      }
    }
  }

  createRequestInfo (config) {
    return reactive({
      requestId: this.$jsonapi.cache.getRequestId(config),
      status: STATUS_IDLE,
    })
  }

  readCachedRequest () {
    const requestId = this.info.requestId
    return this.$jsonapi.cache.readRequest(requestId)
  }

  fetchFromCache () {
    const { data } = this.request || {}
    if (data) this.data = data
    return data
  }

  fetch (options, info = this.info) {
    info.status = STATUS_PENDING
    return this.wrapRequest(this.$jsonapi.request(options), info)
  }

  fetchMore () {
    return this.wrapRequest(this.$jsonapi.fetchMore(this.request))
  }

  wrapRequest (promise, info = this.info) {
    info.status = STATUS_PENDING
    promise
      .then(response => {
        info.status = STATUS_SUCCESS
        return response
      })
      .catch(error => {
        info.status = STATUS_ERROR
        if (this.rawOptions.error) {
          return this.rawOptions.error.call(this.vm, error)
        }
        throw error
      })
    return promise
  }

  refetch () {
    const { skip, config, fetchPolicy } = this.computeOptions()
    if (skip) return
    const noCache = fetchPolicy === POLICY_NO_CACHE
    return this.fetch({ config, noCache })
  }

  onComputeOptionsChange (options, oldOptions) {
    const determinants = ['variables', 'skip']
    pick(options, determinants)
    if (!isEqual(pick(options, determinants), pick(oldOptions, determinants))) {
      this.run(options)
    }
  }

  computeOptions () {
    const skip = typeof this.rawOptions.skip === 'function'
      ? this.rawOptions.skip.call(this.vm) : this.rawOptions.skip
    if (skip) return { skip }
    const variables = typeof this.rawOptions.variables === 'function'
      ? this.rawOptions.variables.call(this.vm) : this.rawOptions.variables
    const config = typeof this.rawOptions.config === 'function'
      ? this.rawOptions.config.call(this.vm, variables) : this.rawOptions.config
    return {
      ...this.rawOptions,
      variables,
      config,
      skip,
    }
  }

  onRequestDataChange (request) {
    if (request) return this.data = request.data
  }
}

export default SmartQuery
