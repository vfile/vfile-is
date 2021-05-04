/**
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef {null|undefined} Nullish
 * @typedef {boolean} FieldExists
 * @typedef {string} FieldEquality
 * @typedef {{prefix?: string, suffix?: string}} FieldPartial
 * @typedef {Nullish|FieldExists|FieldEquality|FieldPartial} Field
 * @typedef {Object.<string, Field>} CheckFields
 * @typedef {string} CheckPath
 * @typedef {Nullish|CheckPath|CheckFile|CheckFields} CheckItem
 * @typedef {Array.<CheckItem>} CheckList
 * @typedef {CheckItem|CheckList} Check
 */

/**
 * Check if a file passes a test
 *
 * @callback CheckFile
 * @param {VFile} file
 * @returns {boolean|void}
 */

/**
 * @callback Assert
 * @param {unknown} [file]
 * @returns {boolean}
 */

import minimatch from 'minimatch'

const Minimatch = minimatch.Minimatch
const own = {}.hasOwnProperty

/**
 * Check if `file` passes the given test.
 *
 * Converts `check` to an assertion and calls that assertion with `file`.
 * If you’re doing a lot of checks, use `convert`.
 *
 * @param {VFile} file
 * @param {Check} [check]
 * @returns {boolean}
 */
export function is(file, check) {
  return convert(check)(file)
}

/**
 * Create a function (the assertion) from `check`, that when given something,
 * returns whether that value is a vfile and whether it passes the given check.
 *
 * @param {Check} [check]
 * @returns {Assert}
 */
export function convert(check) {
  if (check === null || check === undefined) {
    return ok
  }

  if (typeof check === 'string') {
    return matchFactory(check)
  }

  if (typeof check === 'function') {
    return one(check)
  }

  if (typeof check === 'object') {
    return Array.isArray(check) ? anyFactory(check) : checkFactory(check)
  }

  throw new Error('Expected function, string, array, or object as test')
}

/**
 * @param {CheckPath} check
 * @returns {Assert}
 */
function matchFactory(check) {
  var match = new Minimatch(check)
  /** @type {Array.<Array.<string|RegExp>>} */
  // type-coverage:ignore-next-line
  var sets = match.set
  /** @type {Array.<string|RegExp>} */
  var head = sets[0]
  var magic = false
  var index = -1

  // Inlined from: https://github.com/isaacs/node-glob/blob/8fa8d56/glob.js#L97
  if (sets.length > 1) {
    magic = true
  } else {
    while (++index < head.length) {
      if (typeof head[index] !== 'string') {
        magic = true
        break
      }
    }
  }

  return magic ? glob : name

  /** @type {Assert} */
  function glob(file) {
    return ok(file) && match.match(file.path)
  }

  /**
   * True for `index.js` w/ `.js`; `index.js` w/ `index.js`, and `.gitignore`
   * w/ `.gitignore`
   *
   * @type {Assert}
   */
  function name(file) {
    return ok(file) && (check === file.basename || check === file.extname)
  }
}

/**
 * @param {CheckFields} checks
 * @returns {Assert}
 */
function checkFactory(checks) {
  return matches

  /**
   * @type {Assert}
   */
  function matches(file) {
    /** @type {Field} */
    var check
    /** @type {string} */
    var key
    /** @type {unknown} */
    var value

    if (!ok(file)) {
      return false
    }

    for (key in checks) {
      if (own.call(checks, key)) {
        check = checks[key]
        value = file[key]

        if (check === null || check === undefined) {
          continue
        }

        if (typeof check === 'boolean') {
          if (check === !(key in file)) {
            return false
          }
        } else if (typeof check === 'string') {
          if (check !== value) {
            return false
          }
        } else if (check && typeof check === 'object') {
          if (
            typeof value !== 'string' ||
            (check.prefix &&
              value.slice(0, check.prefix.length) !== check.prefix) ||
            (check.suffix && value.slice(-check.suffix.length) !== check.suffix)
          ) {
            return false
          }
        } else {
          throw new Error(
            'Invalid spec `' +
              check +
              '`, expected `boolean`, `string`, or `object`'
          )
        }
      }
    }

    return true
  }
}

/**
 * @param {CheckList} checks
 * @returns {Assert}
 */
function anyFactory(checks) {
  /** @type {Array.<Assert>} */
  var tests = []
  var index = -1

  while (++index < checks.length) {
    tests[index] = convert(checks[index])
  }

  return matches

  /**
   * @type {Assert}
   */
  function matches(file) {
    var index = -1

    if (ok(file)) {
      while (++index < tests.length) {
        if (tests[index](file)) {
          return true
        }
      }
    }

    return false
  }
}

/**
 * @param {CheckFile} check
 * @returns {Assert}
 */
function one(check) {
  return matches

  /** @type {Assert} */
  function matches(file) {
    return ok(file) && Boolean(check(file))
  }
}

/**
 * @param {unknown} [file]
 * @returns {file is VFile}
 */
function ok(file) {
  return Boolean(
    file && typeof file === 'object' && 'messages' in file && 'history' in file
  )
}
