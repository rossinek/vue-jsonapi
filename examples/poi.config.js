if (!process.env.EXAMPLE) throw Error('EXAMPLE env variable is not set')

module.exports = {
  entry: [
    `src/${process.env.EXAMPLE}/index.js`,
    'node_modules/vue-jsonapi/dist/vue-jsonapi.esm.js',
  ],
}
