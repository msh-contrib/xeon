const x = module.exports

const sourcePath  = 'lib/**/*.js'
const distPath = 'dist/'

x.babel = function * (file) {
  yield this.source(file || sourcePath)
    .babel({
      presets: ['es2015']
    })
    .target(distPath)
}

x.default = function * () {
  yield this.watch(sourcePath, 'babel')
}
