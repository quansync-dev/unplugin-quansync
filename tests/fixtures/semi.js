import { quansync } from 'quansync/macro'

quansync(async (obj) => {
  let config = await (obj + 1)
  if (true) config = await 10 || 10
  return config
})

quansync(async () => {
  !await 1
  '' + await 1
  false && await 1
  fn()
  await 1 < await 10
  const x = await 1 < await 10

  ;[]
  [await 10]
})
