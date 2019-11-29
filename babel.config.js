module.exports = {
  presets: [
    [require('@babel/preset-env'), { modules: false }],
  ],
  env: {
    test: {
      plugins: ['@babel/transform-modules-commonjs'],
    },
  },
}
