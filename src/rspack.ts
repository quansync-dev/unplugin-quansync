/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { Quansync } from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```js
 * // rspack.config.js
 * import Quansync from 'unplugin-quansync/rspack'
 *
 * default export {
 *  plugins: [Quansync()],
 * }
 * ```
 */
const rspack = Quansync.rspack as typeof Quansync.rspack
export default rspack
export { rspack as 'module.exports' }
