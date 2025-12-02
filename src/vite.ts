/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { Quansync } from './index'
import type {} from 'unplugin'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Quansync from 'unplugin-quansync/vite'
 *
 * export default defineConfig({
 *   plugins: [Quansync()],
 * })
 * ```
 */
const vite = Quansync.vite as typeof Quansync.vite
export default vite
export { vite as 'module.exports' }
