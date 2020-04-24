'use strict'

var test = require('tape')
var vfile = require('to-vfile')
var is = require('.')

test('vfile-is', function (t) {
  var empty = null
  var file = vfile()
  var index = vfile('index.js')
  var gitignore = vfile('.gitignore')
  var readme = vfile('readme.md')

  t.ok(is(file), 'should support a missing test on a file')
  t.notOk(is(empty), 'should support a missing test with nothing')

  t.ok(is(index, 'index.js'), 'should support a basename (#1)')
  t.notOk(is(file, 'index.js'), 'should support a basename (#2)')
  t.ok(is(index, '.js'), 'should support a extname (#1)')
  t.notOk(is(index, '.md'), 'should support a extname (#2)')
  t.ok(is(gitignore, '.gitignore'), 'should support a dotfile (#1)')
  t.notOk(is(vfile('.gitignore'), '.npmrc'), 'should support a dotfile (#2)')

  t.ok(is(index, '*.js'), 'should support a glob (#1)')
  t.notOk(is(index, '*.md'), 'should support a glob (#2)')
  t.ok(is(index, '*.{js,jsx}'), 'should support a glob (#3)')
  t.notOk(is(readme, '*.{js,jsx}'), 'should support a glob (#4)')

  t.ok(is(index, isIndex), 'should support a function (#1)')
  t.notOk(is(empty, isIndex), 'should support a function (#2)')
  t.notOk(is(readme, isIndex), 'should support a function (#3)')

  t.ok(is(index, {stem: 'index'}), 'should support a spec (#1)')
  t.notOk(is(empty, {stem: 'index'}), 'should support a spec (#2)')
  t.notOk(is(readme, {stem: 'index'}), 'should support a spec (#3)')
  t.ok(is(readme, {stem: {prefix: 're'}}), 'should support a spec (#4)')
  t.ok(is(readme, {stem: {suffix: 'me'}}), 'should support a spec (#5)')
  t.notOk(is(readme, {stem: {prefix: 'in'}}), 'should support a spec (#6)')
  t.notOk(is(readme, {stem: {suffix: 'ex'}}), 'should support a spec (#7)')
  t.notOk(is(readme, {missing: true}), 'should support a spec (#8)')
  t.ok(is(readme, {stem: true}), 'should support a spec (#9)')
  t.ok(is(readme, {missing: false}), 'should support a spec (#10)')
  t.notOk(is(readme, {stem: false}), 'should support a spec (#11)')
  t.ok(is(readme, {stem: null}), 'should ignore nullish specs')

  t.throws(
    function () {
      is(readme, {stem: 1})
    },
    /^Error: Invalid spec `1`, expected `boolean`, `string`, or `object`/,
    'should throw on invalid specs'
  )

  t.notOk(is(null, ['.js', index]), 'should support a list (#1)')
  t.ok(is(index, ['.js', index]), 'should support a list (#2)')
  t.notOk(is(readme, ['.js', index]), 'should support a list (#3)')

  t.throws(
    function () {
      is(readme, 1)
    },
    /^Error: Expected function, string, array, or object as test/,
    'should throw on invalid specs'
  )

  t.end()

  function isIndex(file) {
    return file.stem === 'index'
  }
})
