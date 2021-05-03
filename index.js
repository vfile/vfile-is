import minimatch from 'minimatch'

const Minimatch = minimatch.Minimatch
const own = {}.hasOwnProperty

export function is(file, specs) {
  return convert(specs)(file)
}

export function convert(test) {
  if (test === null || test === undefined) {
    return ok
  }

  if (typeof test === 'string') {
    return matchFactory(test)
  }

  if (typeof test === 'function') {
    return one(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : specFactory(test)
  }

  throw new Error('Expected function, string, array, or object as test')
}

function matchFactory(test) {
  var match = new Minimatch(test)
  var sets = match.set
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

  function glob(file) {
    return ok(file) && match.match(file.path)
  }

  // True for `index.js` w/ `.js`; `index.js` w/ `index.js`, and `.gitignore`
  // w/ `.gitignore`
  function name(file) {
    return ok(file) && (test === file.basename || test === file.extname)
  }
}

function specFactory(test) {
  return matches

  function matches(file) {
    var spec
    var key
    var value

    if (!ok(file)) {
      return false
    }

    for (key in test) {
      if (own.call(test, key)) {
        spec = test[key]
        value = file[key]

        switch (spec) {
          case null:
          case undefined: {
            break
          }

          case true: {
            if (!(key in file)) {
              return false
            }

            break
          }

          case false: {
            if (key in file) {
              return false
            }

            break
          }

          default: {
            if (typeof spec === 'string') {
              if (spec !== value) {
                return false
              }
            } else if (spec && typeof spec === 'object') {
              if (
                typeof value !== 'string' ||
                (spec.prefix &&
                  value.slice(0, spec.prefix.length) !== spec.prefix) ||
                (spec.suffix &&
                  value.slice(-spec.suffix.length) !== spec.suffix)
              ) {
                return false
              }
            } else {
              throw new Error(
                'Invalid spec `' +
                  spec +
                  '`, expected `boolean`, `string`, or `object`'
              )
            }
          }
        }
      }
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = convertAll(tests)

  return matches

  function matches(file) {
    var index = -1

    if (ok(file)) {
      while (++index < checks.length) {
        if (checks[index](file)) {
          return true
        }
      }
    }

    return false
  }
}

function convertAll(tests) {
  var results = []
  var index = -1

  while (++index < tests.length) {
    results[index] = convert(tests[index])
  }

  return results
}

function one(test) {
  return matches

  function matches(file) {
    return ok(file) && Boolean(test(file))
  }
}

function ok(file) {
  return Boolean(file && file.messages && file.history)
}
