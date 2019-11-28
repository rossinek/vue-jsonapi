import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-jsonapi.esm.js',
    format: 'es',
    name: 'vue-jsonapi',
  },
})

export default config
