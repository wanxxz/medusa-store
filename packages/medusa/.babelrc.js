const ignore = [`**/dist`]

module.exports = {
  presets: [['babel-preset-medusa-package'], ['@babel/preset-typescript']],
  ignore
}
