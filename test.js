import assert from 'node:assert/strict'
import test from 'node:test'
import {toVFile} from 'to-vfile'
import {is} from './index.js'

test('is', function () {
  /** @type {null} */
  const empty = null
  const file = toVFile()
  const index = toVFile('index.js')
  const gitignore = toVFile('.gitignore')
  const readme = toVFile('readme.md')

  assert.ok(is(file), 'should support a missing test on a file')
  assert.ok(!is(empty), 'should support a missing test with nothing')

  assert.ok(is(index, 'index.js'), 'should support a basename (#1)')
  assert.ok(!is(file, 'index.js'), 'should support a basename (#2)')
  assert.ok(is(index, '.js'), 'should support a extname (#1)')
  assert.ok(!is(index, '.md'), 'should support a extname (#2)')
  assert.ok(is(gitignore, '.gitignore'), 'should support a dotfile (#1)')
  assert.ok(
    !is(toVFile('.gitignore'), '.npmrc'),
    'should support a dotfile (#2)'
  )

  assert.ok(is(index, '*.js'), 'should support a glob (#1)')
  assert.ok(!is(index, '*.md'), 'should support a glob (#2)')
  assert.ok(is(index, '*.{js,jsx}'), 'should support a glob (#3)')
  assert.ok(!is(readme, '*.{js,jsx}'), 'should support a glob (#4)')

  assert.ok(is(index, isIndex), 'should support a function (#1)')
  assert.ok(!is(empty, isIndex), 'should support a function (#2)')
  assert.ok(!is(readme, isIndex), 'should support a function (#3)')

  assert.ok(is(index, {stem: 'index'}), 'should support a spec (#1)')
  assert.ok(!is(empty, {stem: 'index'}), 'should support a spec (#2)')
  assert.ok(!is(readme, {stem: 'index'}), 'should support a spec (#3)')
  assert.ok(is(readme, {stem: {prefix: 're'}}), 'should support a spec (#4)')
  assert.ok(is(readme, {stem: {suffix: 'me'}}), 'should support a spec (#5)')
  assert.ok(!is(readme, {stem: {prefix: 'in'}}), 'should support a spec (#6)')
  assert.ok(!is(readme, {stem: {suffix: 'ex'}}), 'should support a spec (#7)')
  assert.ok(!is(readme, {missing: true}), 'should support a spec (#8)')
  assert.ok(is(readme, {stem: true}), 'should support a spec (#9)')
  assert.ok(is(readme, {missing: false}), 'should support a spec (#10)')
  assert.ok(!is(readme, {stem: false}), 'should support a spec (#11)')
  assert.ok(is(readme, {stem: null}), 'should ignore nullish specs')

  assert.throws(
    function () {
      // @ts-ignore runtime.
      is(readme, {stem: 1})
    },
    /^Error: Invalid spec `1`, expected `boolean`, `string`, or `object`/,
    'should throw on invalid specs'
  )

  assert.ok(!is(null, ['.js', 'index.js']), 'should support a list (#1)')
  assert.ok(is(index, ['.js', 'index.js']), 'should support a list (#2)')
  assert.ok(!is(readme, ['.js', 'index.js']), 'should support a list (#3)')

  assert.throws(
    function () {
      // @ts-ignore runtime.
      is(readme, 1)
    },
    /^Error: Expected function, string, array, or object as test/,
    'should throw on invalid specs'
  )

  /** @type {import('./index.js').CheckFile} */
  function isIndex(file) {
    return file.stem === 'index'
  }
})
