# vfile-is

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Check if a [`vfile`][vfile] passes a test.

## Install

[npm][]:

```sh
npm install vfile-is
```

## Usage

```js
var vfile = require('to-vfile')
var is = require('vfile-is')

is(null, '.js') // => false
is({}, '.js') // => false

is(vfile('index.js'), '.js') // => true
is(vfile('index.js'), '.md') // => false
is(vfile('index.js'), 'index.js') // => true
is(vfile('index.js'), 'readme.md') // => false
is(vfile('index.js'), '*.js') // => true
is(vfile('index.js'), '*.md') // => false

is(vfile('index.js'), {stem: 'index'}) // => true
is(vfile('index.js'), {stem: 'readme'}) // => false

is(vfile('index.js'), {stem: {prefix: 'in'}}) // => true
is(vfile('index.js'), {stem: {prefix: 're'}}) // => false
is(vfile('index.js'), {stem: {suffix: 'ex'}}) // => true
is(vfile('index.js'), {stem: {suffix: 'me'}}) // => false
```

## API

### `is(file, test)`

Check if `file` passes the given test.

Converts `test` to an [assertion][], and calls that assertion with `file`.
If you’re doing a lot of checks, use `convert` (`is.convert` or
`require('vfile-is/convert')` directly).

### `convert(test)`

Create a function (the assertion) from `test`, that when given something,
returns whether that value is a [vfile][] and whether it passes the given
test.

###### Parameters

*   `test` (`string`, `Function`, `Spec`, or `Array.<test>`, optional)

###### Returns

An [assertion][].

#### `assertion(file)`

When given something, returns whether that value is a [vfile][] and whether it
passes the bound test.

*   If there is no bound test (it’s null or undefined), makes sure `file` is a
    [vfile][]
*   If the bound test is a glob string, checks if that glob matches `file.path`
*   If the bound test is a normal string, checks if that is `file.basename` or
    `file.extname`
*   If the bound test is a normal object, checks if the given file matches the
    [Spec][]
*   If the bound test is an array, all tests in it must pass

### `Spec`

A spec is an object describing properties to values.
For each property in `spec`, if its value is `string`, there must be an
equivalent property in the given file matching the value.
If the value is `object`, it can have a `prefix` or `suffix` key, and the value
in the given file must be a string, and it must start with `prefix` and/or end
with `suffix`.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-is.svg

[build]: https://travis-ci.org/vfile/vfile-is

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-is.svg

[coverage]: https://codecov.io/github/vfile/vfile-is

[downloads-badge]: https://img.shields.io/npm/dm/vfile-is.svg

[downloads]: https://www.npmjs.com/package/vfile-is

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-is.svg

[size]: https://bundlephobia.com/result?p=vfile-is

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/master/contributing.md

[support]: https://github.com/vfile/.github/blob/master/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[assertion]: #assertionfile

[spec]: #spec
