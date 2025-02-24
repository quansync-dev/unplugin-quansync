/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { Quansync } from './index'

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import Quansync from 'unplugin-quansync/farm'
 *
 * export default {
 *   plugins: [Quansync()],
 * }
 * ```
 */
const farm = Quansync.farm as typeof Quansync.farm
export default farm
export { farm as 'module.exports' }
