/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { Quansync } from './index'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import Quansync from 'unplugin-quansync/rolldown'
 *
 * export default {
 *   plugins: [Quansync()],
 * }
 * ```
 */
const rolldown = Quansync.rolldown as typeof Quansync.rolldown
export default rolldown
export { rolldown as 'module.exports' }
