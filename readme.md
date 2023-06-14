# vfile-is

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`vfile`][vfile] utility to check if a file passes a test.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`convert(check)`](#convertcheck)
    *   [`is(file, check?)`](#isfile-check)
    *   [`Assert`](#assert)
    *   [`Check`](#check)
    *   [`CheckFields`](#checkfields)
    *   [`CheckFile`](#checkfile)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a small utility that checks that a file is a certain file.

## When should I use this?

Use this small utility if you find yourself repeating code for checking files.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install vfile-is
```

In Deno with [`esm.sh`][esmsh]:

```js
import {is} from 'https://esm.sh/vfile-is@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {is} from 'https://esm.sh/vfile-is@2?bundle'
</script>
```

## Use

```js
import {VFile} from 'to-vfile'
import {is} from 'vfile-is'

is(undefined, '.js') // => false
is({}, '.js') // => false

is(new VFile({path: 'index.js'}), '.js') // => true
is(new VFile({path: 'index.js'}), '.md') // => false
is(new VFile({path: 'index.js'}), 'index.js') // => true
is(new VFile({path: 'index.js'}), 'readme.md') // => false
is(new VFile({path: 'index.js'}), '*.js') // => true
is(new VFile({path: 'index.js'}), '*.md') // => false

is(new VFile({path: 'index.js'}), {stem: 'index'}) // => true
is(new VFile({path: 'index.js'}), {stem: 'readme'}) // => false

is(new VFile({path: 'index.js'}), {stem: {prefix: 'in'}}) // => true
is(new VFile({path: 'index.js'}), {stem: {prefix: 're'}}) // => false
is(new VFile({path: 'index.js'}), {stem: {suffix: 'ex'}}) // => true
is(new VFile({path: 'index.js'}), {stem: {suffix: 'me'}}) // => false
```

## API

This package exports the identifiers [`convert`][api-convert] and
[`is`][api-is].
There is no default export.

### `convert(check)`

Create an assertion from `check`.

###### Parameters

*   `check` ([`Check`][api-check], optional)
    — check

###### Returns

Assertion ([`Assert`][api-assert]).

### `is(file, check?)`

Check if `file` is a specific file.

Converts `check` to an assertion and calls that assertion with `file`.
If you’re doing a lot of checks, use `convert`.

###### Parameters

*   `file` (`unknown`)
    — file to check (typically [`VFile`][vfile])
*   `check` ([`Check`][api-check], optional)
    — check

###### Returns

Whether `file` is a file and matches `check` (`boolean`).

### `Assert`

Check that a file is a `vfile` and passes a test (TypeScript type).

###### Parameters

*   `file` (`unknown`)
    — file to check (typically [`VFile`][vfile])

###### Returns

Whether `file` is a file and matches a bound `check` (`boolean`).

### `Check`

Different ways to check for a specific file (TypeScript type).

*   if check is a glob string, checks if that glob matches `file.path`
*   if check is a normal string, checks if that is `file.basename` or
    `file.extname`
*   if check is a function, checks whether that yields `true` when called
*   if check is a normal object, checks if the given file matches the
    [`CheckFields`][api-check-fields]
*   if check is an array, all tests in it must pass

###### Type

```ts
type Check =
  | Array<CheckFields | CheckFile | string | null | undefined>
  | CheckFields
  | CheckFile
  | string
  | null
  | undefined
```

### `CheckFields`

Object describing fields to values (TypeScript type).

Each key is a field in the file and each value is:

*   `boolean` — whether the field exists or not
*   `object` — start (prefix) and/or end (suffix) of the field
*   `string` — exact value of that field

###### Type

```ts
type FieldPartial = {
  prefix?: string | null | undefined
  suffix?: string | null | undefined
}

type CheckFields = Record<
  string,
  FieldPartial | boolean | string | null | undefined
>
```

### `CheckFile`

Check if a file passes a custom test (TypeScript type).

###### Parameters

*   `file` ([`VFile`][vfile])
    — file to check

###### Returns

Whether the test passed for this file (`boolean`, optional).

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Assert`][api-assert], [`Check`][api-check],
[`CheckFields`][api-check-fields], and [`CheckFile`][api-check-file].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `vfile-is@^2`, compatible
with Node.js 16.

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

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=vfile-is

[size]: https://bundlejs.com/?q=vfile-is

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[support]: https://github.com/vfile/.github/blob/main/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[api-convert]: #convertcheck

[api-is]: #isfile-check

[api-assert]: #assert

[api-check]: #check

[api-check-fields]: #checkfields

[api-check-file]: #checkfile
