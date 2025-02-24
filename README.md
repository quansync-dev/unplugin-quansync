# unplugin-quansync [![npm](https://img.shields.io/npm/v/unplugin-quansync.svg)](https://npmjs.com/package/unplugin-quansync)

[![Unit Test](https://github.com/unplugin/unplugin-quansync/actions/workflows/unit-test.yml/badge.svg)](https://github.com/unplugin/unplugin-quansync/actions/workflows/unit-test.yml)

Write async functions, get both async and sync functions with
[quansync](https://github.com/antfu/quansync) and compiler magics.

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

```ts
import fs from 'node:fs'
import { quansyncMacro } from 'quansync'

// Create an quansync function by providing `sync` and `async` implementations
const readFile = quansyncMacro({
  sync: (path: string) => fs.readFileSync(path),
  async: (path: string) => fs.promises.readFile(path),
})

// Create an quansync function by providing a **async** function
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

For more details, please refer to the
[quansync documentation](https://github.com/antfu/quansync#usage).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025-PRESENT [三咲智子](https://github.com/sxzz)
