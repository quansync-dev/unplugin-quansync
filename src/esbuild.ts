/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { Quansync } from './index'
import type {} from 'unplugin'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import Quansync from 'unplugin-quansync/esbuild'
 * 
 * build({ plugins: [Quansync()] })
```
 */
const esbuild = Quansync.esbuild as typeof Quansync.esbuild
export default esbuild
export { esbuild as 'module.exports' }
