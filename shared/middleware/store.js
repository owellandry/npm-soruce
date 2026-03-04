'use strict'

module.exports = createStore

function createStore() {
  return {
    processInitial(props, session, next) {
      session.store = {
        dispatch() {},
        subscribe() {},
        getState() {},
      }
      return next()
    },
    processRehydrate(props, session, next) {
      const initialState = {
        rendererName: session.initialRendererName,
        props,
      }
      session.store = session.store || _createStore(initialState)

      const {store, router, registry} = session

      router.events.on('hot-update', function onHot() {
        router.events.off('hot-update', onHot)
        router.setNavEntry(store.getState())
      })

      // anytime the router changes, notify the state
      router.events.on('fetch', () => {
        store.dispatch({type: 'ROUTE_START'})
      })
      router.events.on('route', ({rendererName, props}) => {
        store.dispatch({type: 'ROUTE', rendererName, props})
      })
      router.events.on('error', err => {
        console.error(err)
        store.dispatch({
          type: 'NOTIFICATION_SHOW',
          level: 'error',
          message: 'error loading page',
          duration: 15000,
        })
        store.dispatch({type: 'ROUTE_COMPLETE'})
      })
      store.subscribe(getAndRender)

      return next()

      function getAndRender() {
        const {rendererName, props} = store.getState()
        return registry.getEntry(rendererName).then(renderer => {
          return session.render(renderer, props)
        })
      }
    },
  }
}

function _createStore(initialState) {
  const runners = require('../../client/runners')
  const handlers = require('../../client/handlers')
  const runnersMiddleware = require('../../client/middleware/runners')
  const thunkMiddleware = require('../../client/middleware/thunk')
  return require('../../client/store')(handlers, initialState, [
    // require('../../client/middleware/logger'),
    runnersMiddleware({runners}),
    thunkMiddleware(),
  ])
}
