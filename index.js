'use strict'

var convert = require('./convert')

is.convert = convert

module.exports = is

function is(file, specs) {
  return convert(specs)(file)
}
