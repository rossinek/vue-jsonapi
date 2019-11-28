module.exports.createRecord = (type, model = {}) => {
  const { id, relationships, ...attributes } = model
  return {
    id,
    type,
    attributes,
    relationships,
  }
}
