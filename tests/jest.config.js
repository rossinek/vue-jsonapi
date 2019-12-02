module.exports = {
  setupFiles: [
    './unit/setup.js',
  ],
  transform: {
    '\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    vue: '<rootDir>/node_modules/vue/dist/vue.runtime.esm.js',
  },
}
