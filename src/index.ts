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
        },
        handler(code, id) {
          if (!code.includes('quansync')) return
          return transformQuansync(code, id)
        },
      },
    }
  })
