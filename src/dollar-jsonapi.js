import { Globals } from './params'
import { metadata } from './cache/normalize'
import SmartQuery from './smart-query'

class DollarJsonapi {
  constructor ({ cache = Globals.defaultCache, client = Globals.defaultClient } = {}) {
    this.cache = cache
    this.client = client
    this.queries = {}
  }

  get loading () {
    return Object.keys(this.queries).some(key => this.queries[key].loading)
  }

  addQuery (vm, name, options) {
    this.queries[name] = new SmartQuery(vm, name, options)
  }

  destroy () {
    Object.values(this.queries).forEach(sq => sq.destroy())
  }

  request ({ config, noCache, noRequestCache }) {
    const cacheRequest = config.method === 'get' && !noRequestCache

    let requestCallId
    if (cacheRequest && !noCache) {
      requestCallId = this.cache.initRequest(config)
    }

    return this.client.request(config).then(response => {
      const dataProxy = this.cache.parseResponse(config, response)
      const raw = {
        ...response,
        data: {
          ...response.data,
          data: response.data.data && metadata(response.data.data),
          included: response.data.included && metadata(response.data.included),
        },
      }
      if (!noCache) {
        dataProxy.persist()
        if (cacheRequest) this.cache.writeRequestResponse(config, requestCallId, dataProxy.identification, raw)
      }
      return {
        _dataProxy: dataProxy,
        raw,
        get data () {
          return this._dataProxy.getData()
        },
      }
    })
  }

  async fetchMore (prevResponse) {
    if (prevResponse.raw.data.links && prevResponse.raw.data.links.next) {
      const requestCallId = this.cache.initNextPageRequest(prevResponse.requestId)
      const response = await this.request({
        config: {
          method: 'get',
          url: prevResponse.raw.data.links.next,
        },
        noRequestCache: true,
      })
      this.cache.writeNextPageRequestResponse(prevResponse.requestId, requestCallId, response._dataProxy.identification, response.raw)
      return response
    }
  }
}

export default DollarJsonapi
