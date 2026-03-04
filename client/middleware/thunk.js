'use strict'

// simpler version of redux-thunk
module.exports =
  extraArg =>
  ({dispatch, getState}) =>
  next =>
  action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArg)
    } else {
      return next(action)
    }
  }
