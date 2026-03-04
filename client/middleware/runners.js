'use strict'
module.exports = options => store => next => action => {
  const {type} = action
  const runner = options.runners[type]
  if (!runner) {
    return next(action)
  }

  return runner(store.dispatch, action).catch(err => {
    err.isDispatched = true
    throw err
  })
}
