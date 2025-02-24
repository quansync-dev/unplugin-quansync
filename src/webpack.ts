/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { Quansync } from './index'

/**
 * Webpack plugin
 *
 * @example
 * ```js
 * // webpack.config.js
 * import Quansync from 'unplugin-quansync/webpack'
 *
 * default export {
 *  plugins: [Quansync()],
 * }
 * ```
 */
const webpack = Quansync.webpack as typeof Quansync.webpack
export default webpack
export { webpack as 'module.exports' }
