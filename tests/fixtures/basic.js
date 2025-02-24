// @ts-check
import { quansyncMacro } from 'quansync'
import { expect } from 'vitest'

export const getNumber = quansyncMacro({
  sync: /** @param {number} id */ (id) => id,
  async: (id) => Promise.resolve(id),
})

const inc1 = quansyncMacro(async function () {
  const value = await getNumber(1)
  return value + 1
})

const inc2 = quansyncMacro(async function (id) {
  const value = await getNumber(1)
  return value + 1
})

const inc3 = quansyncMacro(async function named() {
  const value = await getNumber(1)
  return value + 1
})

const inc4 = quansyncMacro(async function named(id) {
  const value = await getNumber(1)
  return value + 1
})

const inc5 = quansyncMacro(async () => {
  const value = await getNumber(1)
  return value + 1
})

const inc6 = quansyncMacro(async (id) => {
  const value = await getNumber(1)
  return value + 1
})

export const fn7 = quansyncMacro(async () => {
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

export default async () => {
  await expect(getNumber(1)).resolves.toBe(1)
  expect(getNumber.sync(1)).toBe(1)
  for (const fn of [inc1, inc2, inc3, inc4, inc5, inc6]) {
    await expect(fn()).resolves.toBe(2)
    expect(fn.sync(1)).toBe(2)
  }
}
