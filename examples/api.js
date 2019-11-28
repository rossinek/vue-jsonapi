module.exports.createRecord = (type, { id, relationships, ...attributes } = {}) => ({ id, type, attributes, relationships })
