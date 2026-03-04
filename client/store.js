'use strict'

const legacyMW = require('./middleware/legacy')
const PRODUCTION = process.env.NODE_ENV === 'production'

const {createStore: createReduxStore, applyMiddleware, compose} = require('redux')

module.exports = function createStore(handlers, initialState, middleware = []) {
  // redux expects this handler to exist if you give the store an initial state
  handlers = Object.assign(
    {
      '@@INIT': a => a,
      '@@redux/INIT': a => a,
    },
    handlers,
  )

  function reducer(prevState, action) {
    const {type} = action
    const handler = handlers[type]
    // we are more particular about unhandled actions than your standard reducer
    if (!handler) throw new Error(`No such action handler: ${type}`)

    return handler(prevState, action)
  }

  // legacyMW has to be the first middleware, because it potentially changes
  // the shape of the action
  const mw = [legacyMW].concat(middleware)

  if (PRODUCTION) {
    return createReduxStore(reducer, initialState, applyMiddleware(...mw))
  }

  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  return createReduxStore(reducer, initialState, composeEnhancers(applyMiddleware(...mw)))
}
