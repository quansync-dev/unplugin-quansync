/// <reference types="vite/client" />
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { testFixtures } from '@sxzz/test-utils'
import { RolldownMagicString } from 'rolldown'
import { describe, expect, test } from 'vitest'
import { langFromPath, parse } from 'yuku-parser'
import { transformQuansync } from '../src/core'
import type { RolldownString } from 'rolldown-string'

describe('transform', async () => {
  const dirname = import.meta.dirname
  await testFixtures(
    import.meta.glob<string>('./fixtures/*.js', {
      eager: true,
      query: '?raw',
      import: 'default',
    }),
    async (args, id, code) => {
      const result = transform(code, id)
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

function transform(code: string, id = 'input.js'): string {
  const s = new RolldownMagicString(code)
  transformQuansync(s as any as RolldownString, id)
  return s.toString()
}

test.each(['ts', 'mts', 'cts', 'ts?raw', 'ts#source'])(
  'transforms TypeScript in .%s files',
  (extension) => {
    const result = transform(
      `import { quansync } from 'quansync/macro'
quansync(async (value: number) => await value as number)
quansync(async () => { await 1 satisfies number })`,
      `input.${extension}`,
    )
    expect(result).toMatchInlineSnapshot(`
      "import { quansync } from 'quansync/macro'
      quansync(function* (value: number) {
      return (yield value) as number
      })
      quansync(function* () { ;(yield 1) satisfies number })"
    `)
    expect(parse(result, { lang: 'ts' }).diagnostics).toEqual([])
  },
)

test.each(['jsx', 'tsx'])('preserves JSX in .%s files', (extension) => {
  const result = transform(
    `import { quansync } from 'quansync/macro'
quansync(async () => <div>{await 1}</div>)`,
    `input.${extension}`,
  )
  expect(result).toContain('<div>{yield 1}</div>')
  expect(
    parse(result, { lang: langFromPath(`input.${extension}`) }).diagnostics,
  ).toEqual([])
})

test.each([
  `import type { quansync } from 'quansync/macro'`,
  `import { type quansync } from 'quansync/macro'`,
  `import { quansync } from 'quansync'`,
])('ignores non-macro value imports: %s', (declaration) => {
  const code = `${declaration}\nquansync(async () => await 1)`
  expect(transform(code, 'input.ts')).toBe(code)
})

test('preserves Unicode offsets and string-named imports', () => {
  expect(
    transform(`import { 'quansync' as q } from 'quansync/macro'
const text = '你好 👋'
q(async () => await text)`),
  ).toMatchInlineSnapshot(`
    "import { 'quansync' as q } from 'quansync/macro'
    const text = '你好 👋'
    q(function* () {
    return yield text
    })"
  `)
})

test('rejects invalid syntax before changing the source', () => {
  const code = `import { quansync } from 'quansync/macro'
quansync(async () => await )`
  const s = new RolldownMagicString(code)
  expect(() =>
    transformQuansync(s as any as RolldownString, 'invalid.js'),
  ).toThrowError(SyntaxError)
  expect(s.toString()).toBe(code)
})
