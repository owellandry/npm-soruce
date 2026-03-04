'use strict'

const normalize = require('../shared/normalize-middleware')
const middleware = require('../shared/middleware').map(normalize)
const Router = require('../shared/router')
const onion = require('../shared/onion')
const Registry = require('./registry')
const render = require('./render')

const initialContext = window.__context__

const {
  chunks,
  publicPath,
  containerId,
  headerName,
  hash: manifestHash,
  context: initialProps,
  name: initialRendererName,
} = initialContext

const container = document.getElementById(containerId)
const registry = new Registry({
  initialRendererName,
  publicPath,
  chunks,
})

// needed so lazily-loaded pages can register themselves
module.exports = registry

let router, rerender

registry.onAccept = () => {
  router && router.events.emit('hot-update')
  rerender && rerender()
}

function init() {
  router = Router.get({
    initialRendererName,
    initialProps,
    headerName,
    manifestHash,
    registry,
  })

  const check = {
    resolve(resp) {
      return resp
    },
    reject(err) {
      throw err
    },
  }

  const session = {
    router,
    registry,
    render: doRender,
    initialRendererName,
  }

  const {rendererName, props} = router.state
  onion(
    middleware,
    (mw, props, session, next) => mw.processRehydrate(props, session, next),
    check,
    () => registry.getEntry(rendererName).then(renderer => doRender(renderer, props)),
    props,
    session,
  )

  function doRender(renderer, props) {
    return render(container, renderer, props, middleware, session)
  }

  rerender = () => {
    const {rendererName, props} = router.state
    registry.getEntry(rendererName).then(renderer => doRender(renderer, props))
  }
}

const doc = document
if (doc.readyState === 'interactive' || doc.readyState === 'complete') {
  init()
} else {
  doc.addEventListener('DOMContentLoaded', init)
}
