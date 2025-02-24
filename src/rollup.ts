/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { Quansync } from './index'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import Quansync from 'unplugin-quansync/rollup'
 *
 * export default {
 *   plugins: [Quansync()],
 * }
 * ```
 */
const rollup = Quansync.rollup as typeof Quansync.rollup
export default rollup
export { rollup as 'module.exports' }
