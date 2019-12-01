import { Globals } from './params'
import { metadata } from './cache/normalize'
import SmartQuery from './smart-query'

class DolarJsonapi {
  constructor ({ cache = Globals.defaultCache, client = Globals.defaultClient } = {}) {
    this.cache = cache
    this.client = client
    this.queries = {}
  }

  addQuery (vm, name, options) {
    this.queries[name] = new SmartQuery(vm, name, options)
  }

  destroy () {
    Object.values(this.queries).forEach(sq => sq.destroy())
  }

  request ({ config, noCache }) {
    const cacheRequest = config.method === 'get'
    if (cacheRequest && !noCache) {
      this.cache.initRequest(config)
    }

    return this.client.request(config).then(response => {
      const parsed = this.cache.parseResponse(config, response)
      const raw = {
        ...response,
        data: {
          ...response.data,
          data: response.data.data && metadata(response.data.data),
          included: response.data.included && metadata(response.data.included),
        },
      }
      if (!noCache) {
        parsed.persist()
        if (cacheRequest) this.cache.writeRequestData(config, parsed.getData, raw)
      }
      return {
        raw,
        get data () {
          return parsed.getData()
        },
      }
    })
  }
}

export default DolarJsonapi
