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

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install vfile-is
```

## Use

```js
import {toVFile} from 'to-vfile'
import {is} from 'vfile-is'

is(null, '.js') // => false
is({}, '.js') // => false

is(toVFile('index.js'), '.js') // => true
is(toVFile('index.js'), '.md') // => false
is(toVFile('index.js'), 'index.js') // => true
is(toVFile('index.js'), 'readme.md') // => false
is(toVFile('index.js'), '*.js') // => true
is(toVFile('index.js'), '*.md') // => false

is(toVFile('index.js'), {stem: 'index'}) // => true
is(toVFile('index.js'), {stem: 'readme'}) // => false

is(toVFile('index.js'), {stem: {prefix: 'in'}}) // => true
is(toVFile('index.js'), {stem: {prefix: 're'}}) // => false
is(toVFile('index.js'), {stem: {suffix: 'ex'}}) // => true
is(toVFile('index.js'), {stem: {suffix: 'me'}}) // => false
```

## API

This package exports the following identifiers: `is`.
There is no default export.

### `is(file, test?)`

Check if `file` passes the given test.

Converts `test` to an [assertion][] and calls that assertion with `file`.
If you’re doing a lot of checks, use `convert`.

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

*   If there is no bound test (it’s nullish), makes sure `file` is a [vfile][]
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

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/vfile/vfile-is/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-is/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-is.svg

[coverage]: https://codecov.io/github/vfile/vfile-is

[downloads-badge]: https://img.shields.io/npm/dm/vfile-is.svg

[downloads]: https://www.npmjs.com/package/vfile-is

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-is.svg

[size]: https://bundlephobia.com/result?p=vfile-is

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/HEAD/contributing.md

[support]: https://github.com/vfile/.github/blob/HEAD/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[assertion]: #assertionfile

[spec]: #spec
