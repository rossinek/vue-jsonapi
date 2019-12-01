if (!process.env.BUILD && !process.env.EXAMPLE) throw Error('EXAMPLE env variable is not set')

module.exports = process.env.BUILD ? {} : {
  entry: [
    `src/${process.env.EXAMPLE}/index.js`,
    'node_modules/vue-jsonapi/dist/vue-jsonapi.esm.js',
  ],
}
