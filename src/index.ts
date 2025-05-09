import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { transformQuansync } from './core'
import { resolveOptions, type Options } from './core/options'

export const Quansync: UnpluginInstance<Options | undefined, false> =
  createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)

    const name = 'unplugin-quansync'
    return {
      name,
      enforce: options.enforce,

      transform: {
        filter: {
          id: {
            include: options.include,
            exclude: options.exclude,
          },
          code: 'quansync',
        },
        handler(code, id) {
          return transformQuansync(code, id)
        },
      },
    }
  })
