import { omit } from '../utils'

export const normalize = (ctx, record) => {
  const model = {
    __type: record.type,
    id: record.id,
    ...record.attributes,
  }
  const relationships = record.relationships || {}
  Object.keys(relationships).forEach(relation => {
    if (Object.hasOwnProperty.call(relationships[relation], 'data')) {
      const data = relationships[relation].data
      Object.defineProperty(model, relation, {
        get () {
          if (Array.isArray(data)) return data.map(item => ctx.read(item))
          else if (data) return ctx.read(data)
          return null
        },
        enumerable: true,
        configurable: true,
      })
    } else {
      model[relation] = null
    }
  })
  return model
}

export const metadata = (resource) => {
  if (Array.isArray(resource)) return resource.map(r => omit(r, ['attributes']))
  return omit(resource, ['attributes'])
}
