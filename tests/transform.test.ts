/// <reference types="vite/client" />
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { testFixtures } from '@sxzz/test-utils'
import { describe } from 'vitest'
import { transformQuansync } from '../src/core'

describe('transform', async () => {
  const dirname = import.meta.dirname
  await testFixtures(
    import.meta.glob<string>('./fixtures/*.js', {
      eager: true,
      query: '?raw',
      import: 'default',
    }),
    async (args, id, code) => {
      const result = transformQuansync(code, id)?.code
      if (!result) return result

      const filePath = path.resolve(dirname, `temp/${path.basename(id)}`)
      await writeFile(filePath, result)
      const mod = await import(`${pathToFileURL(filePath).href}?${Date.now()}`)
      await mod.default?.()

      return result
    },
    { promise: true },
  )
})
