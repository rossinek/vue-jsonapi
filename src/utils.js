export const asTruthyArray = (obj) => (Array.isArray(obj) ? obj : [obj]).filter(Boolean)

export const mapOrCall = (obj, func) => Array.isArray(obj) ? obj.map(func) : func(obj)

export const pick = (input = {}, keys = []) => keys.reduce((output, key) => {
  output[key] = input[key]
  return output
}, {})

export const omit = (input = {}, keys = []) => Object.keys(input).reduce((output, key) => {
  if (!keys.includes(key)) output[key] = input[key]
  return output
}, {})

export const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

export const isGetter = (obj, key) => !!obj && isGetterDescriptor(Object.getOwnPropertyDescriptor(obj, key))

const isGetterDescriptor = descriptor => !!descriptor && Object.hasOwnProperty.call(descriptor, 'get')

const isDef = v => v !== undefined || v !== null

export const assignPropertyDescriptor = (target, prop, newDescriptor) => {
  const oldDescriptor = Object.getOwnPropertyDescriptor(target, prop)
  // prevent attribute to override relationship
  // (override property only if empty value or it was direct value)
  if (!isGetterDescriptor(oldDescriptor) || isGetterDescriptor(newDescriptor) || !isDef(newDescriptor.value)) {
    Object.defineProperty(target, prop, { ...newDescriptor, configurable: true })
  }
}

export const assignPropertyDescriptors = (target, ...sources) => {
  sources.forEach(source => Object.keys(source || {})
    .forEach(prop => assignPropertyDescriptor(target, prop, Object.getOwnPropertyDescriptor(source, prop))))
  return target
}

export const reactiveEnsurePath = (target, path, empty = {}) => {
  path.reduce((current, prop, index) => {
    if (!current[prop]) {
      current[prop] = index < path.length - 1 ? {} : empty
    }
    return current[prop]
  }, target)
}

export const reactiveAssign = (target, ...sources) => {
  sources.forEach(source => {
    Object.keys(source).forEach(prop => {
      target[prop] = source[prop]
    })
  })
}
