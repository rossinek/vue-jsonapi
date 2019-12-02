module.exports = {
  extends: '../babel.config.js',
  env: {
    test: {
      plugins: ['@babel/transform-modules-commonjs'],
    },
  },
}
