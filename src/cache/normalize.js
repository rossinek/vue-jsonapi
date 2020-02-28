import { mapOrCall, omit, pick, isGetter, assignPropertyDescriptor } from '../utils'

export const normalize = (ctx, record) => {
  const model = {
    __type: record.type,
    id: record.id,
    ...record.attributes,
  }
  const relationships = record.relationships || {}
  Object.keys(relationships).forEach(relation => {
    if (Object.hasOwnProperty.call(relationships[relation], 'data')) {
      assignRelationship(ctx, model, relation, relationships[relation].data)
    }
  })
  return model
}

const assignRelationship = (ctx, model, key, data) => {
  assignPropertyDescriptor(model, key, {
    get () {
      if (data) return mapOrCall(data, d => ctx.read(d))
      return null
    },
    enumerable: true,
    configurable: true,
  })
  return model
}

export const metadata = (resource) => {
  return resource && mapOrCall(resource, r => omit(r, ['attributes']))
}

export const identification = (resource) => {
  return resource && mapOrCall(resource, r => pick(r, ['id', 'type']))
}

export const reverseIdentification = (normalizedResource) => {
  return normalizedResource && mapOrCall(normalizedResource, r => ({ id: r.id, type: r.__type }))
}

const isResource = data => !!(data && data.__type)

const isResourceCollection = data => Array.isArray(data) && data.some(isResource)

export const normalizeRelationships = (ctx, normalizedResource, ignoreRelated) => {
  const prev = ctx.read(normalizedResource)

  return Object.keys(normalizedResource).reduce((model, key) => {
    const value = normalizedResource[key]
    const isEmptyRelation = () => isGetter(prev, key) && (value === null || (Array.isArray(value) && !value.length))
    if (value !== undefined && (isResourceCollection(value) || isResource(value) || isEmptyRelation())) {
      if (!ignoreRelated) {
        mapOrCall(value, r => r && ctx.write(r))
      }
      assignRelationship(ctx, model, key, value)
    } else {
      assignPropertyDescriptor(model, key, Object.getOwnPropertyDescriptor(normalizedResource, key))
    }
    return model
  }, {})
}
