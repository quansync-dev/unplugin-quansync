// @ts-check
import { quansyncMacro } from 'quansync'
import { expect } from 'vitest'

export const echo = quansyncMacro({
  sync: /** @param {string} v */ (v) => v,
  async: (v) => Promise.resolve(v),
})

const echoNewLine = quansyncMacro(
  /** @param {string|Promise<string>} v */ async (v) =>
    (await echo(await v)) + '\n',
)

export default async () => {
  const iter = echoNewLine('hello')
  expect(iter).a('Generator')
  await expect(iter).resolves.toBe('hello\n')
  expect(echoNewLine.sync('world')).toBe('world\n')

  await expect(echoNewLine(Promise.resolve('hello'))).resolves.toBe('hello\n')
  expect(() => echoNewLine.sync(Promise.resolve('world'))).throw()
}
