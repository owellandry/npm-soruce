'use strict'

module.exports = store => next => (typeOrAction, data) => {
  if (typeof typeOrAction === 'string') {
    // it's an old-style action
    return store.dispatch(Object.assign({}, data, {type: typeOrAction}))
  }
  return next(typeOrAction)
}
