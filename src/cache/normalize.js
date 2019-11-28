import { omit } from '../utils'

export const normalize = (ctx, record) => {
  const model = {
    __type: record.type,
    id: record.id,
    ...record.attributes,
  }
  const relationships = record.relationships || {}
  Object.keys(relationships).forEach(relation => {
    const data = relationships[relation].data
    if (data) {
      Object.defineProperty(model, relation, {
        get () {
          if (Array.isArray(data)) return data.map(item => ctx.read(item))
          return ctx.read(data)
        },
        enumerable: true,
        configurable: true,
      })
    }
  })
  return model
}

export const metadata = (resource) => {
  if (Array.isArray(resource)) return resource.map(r => omit(r, ['attributes']))
  return omit(resource, ['attributes'])
}
