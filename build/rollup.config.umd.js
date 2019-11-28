import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-jsonapi.umd.js',
    format: 'umd',
    globals: {
      vue: 'Vue',
    },
    name: 'vue-jsonapi',
  },
})

export default config
