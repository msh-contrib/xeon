var Bundle = require('./out/bundle').Bundle

var code = `
  name = "test"

  test() {
    echo $name
  }
`

var bundle = new Bundle({
  entry: {
    name: 'test',
    rawSource: code,
    path: 'test'
  },
  options: {}
})

console.log(bundle.buildBundle())
