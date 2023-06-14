/**
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @callback Assert
 *   Check that a file is a `vfile` and passes a test.
 * @param {unknown} [file]
 *   File to check (typically `VFile`).
 * @returns {boolean}
 *   Whether `file` is a file and matches a bound `check`.
 *
 * @callback CheckFile
 *   Check if a file passes a custom test.
 * @param {VFile} file
 *   File to check.
 * @returns {boolean | null | undefined | void}
 *   Whether the test passed for this file.
 *
 * @typedef {Record<string, FieldPartial | boolean | string | null | undefined>} CheckFields
 *   Object describing fields to values.
 *
 *   Each key is a field in the file and each value is:
 *
 *   *   `boolean` — whether the field exists or not
 *   *   `string` — exact value of that field
 *   *   `object` — start (prefix) and/or end (suffix) of the field
 *
 * @typedef {CheckFields | CheckFile | string | null | undefined} CheckItem
 * @typedef {Array<CheckItem> | CheckItem} Check
 *   Different ways to check for a specific file.
 *
 *   *   if check is a glob string, checks if that glob matches `file.path`
 *   *   if check is a normal string, checks if that is `file.basename` or
 *       `file.extname`
 *   *   if check is a function, checks whether that yields `true` when called
 *   *   if check is a normal object, checks if the given file matches the
 *       `Spec`
 *   *   if check is an array, all tests in it must pass
 *
 * @typedef FieldPartial
 *   Check the prefix and/or suffix of a field.
 * @property {string | null | undefined} [prefix]
 *   Prefix.
 * @property {string | null | undefined} [suffix]
 *   Suffix.
 *
 */

import {Minimatch} from 'minimatch'

const own = {}.hasOwnProperty

/**
 * Create an assertion from `check`.
 *
 * @param {Check} [check]
 *   Check.
 * @returns {Assert}
 *   Assertion.
 */
export function convert(check) {
  if (check === null || check === undefined) {
    return ok
  }

  if (typeof check === 'function') {
    return createAssert(check)
  }

  if (typeof check === 'object') {
    return Array.isArray(check)
      ? createAsserts(check)
      : createFieldsAssert(check)
  }

  if (typeof check === 'string') {
    return createPathAssert(check)
  }

  throw new Error('Expected function, string, array, or object as test')
}

/**
 * Check if `file` is a specific file.
 *
 * Converts `check` to an assertion and calls that assertion with `file`.
 * If you’re doing a lot of checks, use `convert`.
 *
 * @param {unknown} file
 *   File to check (typically `VFile`).
 * @param {Check} [check]
 *   Check.
 * @returns {boolean}
 *   Whether `file` is a file and matches `check`.
 */
export function is(file, check) {
  return convert(check)(file)
}

/**
 * Check a function.
 *
 * @param {CheckFile} check
 *   Check.
 * @returns {Assert}
 *   Assertion.
 */
function createAssert(check) {
  return matches

  /** @type {Assert} */
  function matches(file) {
    return ok(file) && Boolean(check(file))
  }
}

/**
 * Checks.
 *
 * @param {Array<CheckItem>} checks
 *   Check.
 * @returns {Assert}
 *   Assertion.
 */
function createAsserts(checks) {
  /** @type {Array<Assert>} */
  const tests = []
  let index = -1

  while (++index < checks.length) {
    tests[index] = convert(checks[index])
  }

  return matches

  /**
   * @type {Assert}
   */
  function matches(file) {
    let index = -1

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
 * @param {CheckFields} checks
 *   Check.
 * @returns {Assert}
 *   Assertion.
 */
function createFieldsAssert(checks) {
  return matches

  /** @type {Assert} */
  function matches(file) {
    if (!ok(file)) {
      return false
    }

    /** @type {string} */
    let key

    for (key in checks) {
      if (own.call(checks, key)) {
        const check = checks[key]
        // @ts-expect-error: things are indexable in JavaScript.
        const value = /** @type {unknown} */ (file[key])

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
 * Check a glob or basename/extname.
 *
 * @param {string} check
 *   Check.
 * @returns {Assert}
 *   Assertion.
 */
function createPathAssert(check) {
  const match = new Minimatch(check)
  const sets = match.set
  const head = sets[0]
  let magic = false
  let index = -1

  // Inlined from:
  // <https://github.com/isaacs/node-glob/blob/3a5a70a/glob.js#L104-L112>
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
 * Check if `value` looks like a vfile.
 *
 * @param {unknown} [value]
 *   Value to check.
 * @returns {value is VFile}
 *   Whether `value` is a vfile.
 */
function ok(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'messages' in value &&
      'history' in value
  )
}
