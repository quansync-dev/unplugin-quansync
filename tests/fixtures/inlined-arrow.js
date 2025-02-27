// @ts-check
import { quansync } from 'quansync/macro'
import { expect } from 'vitest'

export const echo = quansync({
  sync: /** @param {string} v */ (v) => v,
  async: (v) => Promise.resolve(v),
})

const echoNewLine = quansync(
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
