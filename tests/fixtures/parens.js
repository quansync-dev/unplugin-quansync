import { quansync } from 'quansync/macro'

const parens = quansync(async (obj) => {
  const config = await (obj + 1)
  return config
})
