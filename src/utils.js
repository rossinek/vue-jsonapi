import { Globals } from './params'

export const asTruthyArray = (obj) => (Array.isArray(obj) ? obj : [obj]).filter(Boolean)

export const pick = (input = {}, keys = []) => keys.reduce((output, key) => {
  output[key] = input[key]
  return output
}, {})

export const omit = (input = {}, keys = []) => Object.keys(input).reduce((output, key) => {
  if (!keys.includes(key)) output[key] = input[key]
  return output
}, {})

export const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

export const assignPropertyDescriptors = (target, ...sources) => {
  sources.forEach(source => {
    Object.keys(source).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(source, prop)
      Object.defineProperty(target, prop, { ...descriptor, configurable: true })
    })
  })
  return target
}

export const reactiveEnsurePath = (target, path, empty = {}) => {
  path.reduce((current, prop, index) => {
    if (!current[prop]) {
      Globals.Vue.set(current, prop, index < path.length - 1 ? {} : empty)
    }
    return current[prop]
  }, target)
}

export const reactiveAssign = (target, ...sources) => {
  sources.forEach(source => {
    Object.keys(source).forEach(prop => {
      Globals.Vue.set(target, prop, source[prop])
    })
  })
}
