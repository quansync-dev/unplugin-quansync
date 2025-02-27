// @ts-check
import { quansync } from 'quansync/macro'
import { expect } from 'vitest'

const globalThis = this

const arrowFn = quansync(async () => {
  return this
})

const normalFunction = quansync(async function () {
  return this
})

class Cls {
  arrowFn() {
    return arrowFn.call(this)
  }
  normalFunction() {
    return normalFunction.call(this)
  }
}

export default async () => {
  const cls = new Cls()
  expect(await cls.arrowFn()).toBe(globalThis)
  expect(await cls.normalFunction()).instanceOf(Cls)
}
