import { mapOrCall, omit, pick } from '../utils'

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
    }
  })
  return model
}

export const metadata = (resource) => {
  return resource && mapOrCall(resource, r => omit(r, ['attributes']))
}

export const identification = (resource) => {
  return resource && mapOrCall(resource, r => pick(r, ['id', 'type']))
}
