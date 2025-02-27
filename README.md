# unplugin-quansync [![npm](https://img.shields.io/npm/v/unplugin-quansync.svg)](https://npmjs.com/package/unplugin-quansync)

[![Unit Test](https://github.com/unplugin/unplugin-quansync/actions/workflows/unit-test.yml/badge.svg)](https://github.com/unplugin/unplugin-quansync/actions/workflows/unit-test.yml)

Write async functions, get both async and sync functions with
[quansync](https://github.com/antfu/quansync) and compile-time magics 🪄.

## Features

- 🪄 **Compile-time magic**: Write async functions, get both async and sync functions.
- 🦾 **Type-safe**: Fully typed with TypeScript.
- 🌱 **Lightweight**: No runtime dependencies.
- 🚀 **Zero-config**: Works out of the box with Vite, Rollup, Webpack, esbuild, and more.

## Installation

```bash
npm i -D unplugin-quansync
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Quansync from 'unplugin-quansync/vite'

export default defineConfig({
  plugins: [Quansync()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Quansync from 'unplugin-quansync/rollup'

export default {
  plugins: [Quansync()],
}
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```ts
// rolldown.config.js
import Quansync from 'unplugin-quansync/rolldown'

export default {
  plugins: [Quansync()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import { build } from 'esbuild'
import Quansync from 'unplugin-quansync/esbuild'

build({
  plugins: [Quansync()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```js
// webpack.config.js
import Quansync from 'unplugin-quansync/webpack'

export default {
  /* ... */
  plugins: [Quansync()],
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// rspack.config.js
import Quansync from 'unplugin-quansync/rspack'

export default {
  /* ... */
  plugins: [Quansync()],
}
```

<br></details>

## Usage

Here is an example:

```ts
import fs from 'node:fs'
import { quansyncMacro } from 'quansync'

// Create a quansync function by providing `sync` and `async` implementations
const readFile = quansyncMacro({
  sync: (path: string) => fs.readFileSync(path),
  async: (path: string) => fs.promises.readFile(path),
})

// Create a quansync function by providing an **async** function
const myFunction = quansyncMacro(async function (filename) {
  // Use `await` to call another quansync function
  const code = await readFile(filename, 'utf8')

  return `// some custom prefix\n${code}`
})

// Use it as a sync function
const result = myFunction.sync('./some-file.js')

// Use it as an async function
const asyncResult = await myFunction.async('./some-file.js')
```

For more details on usage, refer to [quansync's docs](https://github.com/antfu-collective/quansync#usage).

## How it works

`unplugin-quansync` transforms your async functions into generator functions with `quansyncMacro`,
and transforms `await` into `yield`.

The example above is transformed into:

```ts
import fs from 'node:fs'
import { quansyncMacro } from 'quansync'

// No transformations needed for objects
const readFile = quansyncMacro({
  sync: (path: string) => fs.readFileSync(path),
  async: (path: string) => fs.promises.readFile(path),
})

// `async function` is transformed into a generator function
const myFunction = quansyncMacro(function* (filename) {
  // `await` is transformed into `yield ...`
  const code = yield readFile(filename, 'utf8')

  return `// some custom prefix\n${code}`
})
```

## Caveats

### Arrow functions

Both arrow functions and generators have been available since ES2015,
but a "generator arrow function" syntax does not exist
[yet](https://github.com/tc39/proposal-generator-arrow-functions).

You can still use arrow functions with `quansyncMacro`,
but they will be transformed into generator functions,
retaining `this` binding and omitting the `arguments` object.

```ts
const echoNewLine = quansyncMacro(() => 42)

// Transforms to:

const echoNewLine = quansyncMacro((v) => {
  return function* () {
    return 42
  }.call(this)
})
```

To minimize runtime overhead, prioritize using regular functions.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025-PRESENT [三咲智子](https://github.com/sxzz)
