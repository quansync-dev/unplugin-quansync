// @ts-check
import { quansync } from 'quansync/macro'
import { expect } from 'vitest'

export const getNumber = quansync({
  sync: /** @param {number} id */ (id) => id,
  async: (id) => Promise.resolve(id),
})

const inc1 = quansync(async function () {
  const value = await getNumber(1)
  return value + 1
})

const inc2 = quansync(async function (id) {
  const value = await getNumber(1)
  return value + 1
})

const inc3 = quansync(async function named() {
  const value = await getNumber(1)
  return value + 1
})

const inc4 = quansync(async function named(id) {
  const value = await getNumber(1)
  return value + 1
})

const inc5 = quansync(async () => {
  const value = await getNumber(1)
  return value + 1
})

const inc6 = quansync(async (id) => {
  const value = await getNumber(1)
  return value + 1
})

export const fn7 = quansync(async () => {
  await 1
  await 2
  const fn = async () => {
    await 3
  }
  async function x() {
    await 4
  }
  class Foo {
    async x() {
      await 10
    }
    async #x() {
      await 10
    }
  }
})

quansync(async () => {
  !await 1
  '' + await 1
  false && await 1
  fn7()
  await 1 < await 10
  const x = await 1 < await 10
})

export default async () => {
  await expect(getNumber(1)).resolves.toBe(1)
  expect(getNumber.sync(1)).toBe(1)
  for (const fn of [inc1, inc2, inc3, inc4, inc5, inc6]) {
    await expect(fn()).resolves.toBe(2)
    expect(fn.sync(1)).toBe(2)
  }
}
