import DollarJsonapi from './dollar-jsonapi'
import { Globals } from './params'
import DefaultCache from './cache'

const plugin = DollarJsonapi

function install (app, { Cache = DefaultCache, client }) {
  if (install.installed) return
  install.installed = true

  Globals.defaultCache = new Cache()
  Globals.defaultClient = client

  // Options merging
  app.config.optionMergeStrategies.jsonapi = (to, from) => ({ ...(from || {}), ...(to || {}) })

  // Lazy creation
  Object.defineProperty(app.config.globalProperties, '$jsonapi', {
    get () {
      if (!this.$_jsonapi) {
        this.$_jsonapi = new DollarJsonapi()
      }
      return this.$_jsonapi
    },
  })

  app.mixin({
    created () {
      const queries = this.$options.jsonapi
      if (queries) {
        const queriesNames = Object.keys(queries)
        queriesNames.forEach(name => {
          this.$jsonapi.addQuery(this, name, queries[name])
        })
      }
    },
    beforeUnmount () {
      if (this.$_jsonapi) {
        this.$_jsonapi.destroy()
      }
    },
  })
}

plugin.install = install

export default plugin

export { default as Cache } from './cache'
