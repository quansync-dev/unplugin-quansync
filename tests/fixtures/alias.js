// @ts-check
import { quansync, quansyncMacro as x } from 'quansync'
import { expect } from 'vitest'

export const echo = quansync({
  sync: /** @param {string} v */ (v) => v,
  async: (v) => Promise.resolve(v),
})

const echoNewLine = x(
  /** @param {string|Promise<string>} v */ async function (v) {
    const contents = await echo(await v)
    return contents + '\n'
  },
)

export default async () => {
  const iter = echoNewLine('hello')
  expect(iter).a('Generator')
  await expect(iter).resolves.toBe('hello\n')
  expect(echoNewLine.sync('world')).toBe('world\n')

  await expect(echoNewLine(Promise.resolve('hello'))).resolves.toBe('hello\n')
  expect(() => echoNewLine.sync(Promise.resolve('world'))).throw()
}
