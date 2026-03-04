'use strict'

module.exports = onion

const once = require('once')

function onion(mw, each, after, inner, ...args) {
  let idx = 0
  const argIdx = args.push(null) - 1
  mw = [...mw]

  return Promise.resolve().then(() => iter())

  function iter() {
    const middleware = mw[idx]
    if (!middleware) {
      return Promise.resolve()
        .then(() => inner(...args))
        .then(after.resolve, after.reject)
    }

    idx += 1
    args[argIdx] = once(() => {
      return Promise.resolve().then(() => iter())
    })
    return Promise.resolve()
      .then(() => each(middleware, ...args))
      .then(after.resolve, after.reject)
  }
}
