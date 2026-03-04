'use strict'

const loadPath = require('./load-path')
const parsePath = require('./parse-path')
const _mitt = require('mitt')
const {dispatchHashChangeEvent} = require('../../lib/utils/dom.js')

const mitt = _mitt.default || _mitt

const IS_NODE = typeof window === 'undefined'
let router = null

module.exports = class Router {
  constructor(
    {headerName, manifestHash, initialRendererName, initialProps},
    location = IS_NODE ? {} : window.location,
  ) {
    this.xhr = null
    this.headerName = headerName
    this.manifestHash = manifestHash
    this.pathname = location.pathname
    this.search = location.search
    this.hash = location.hash
    this.events = mitt()
    this.navigation = new Promise((resolve, reject) => {
      this.resolveNavigation = resolve
      this.rejectNavigation = reject
    })

    this.state = {
      props: initialProps,
      rendererName: initialRendererName,
    }

    if (!IS_NODE) {
      this.changeState('replaceState', this.state)
      window.addEventListener('popstate', ev => this.onpopstate(ev))
    }
  }

  static get(config) {
    if (router) {
      return router
    }
    router = new Router(config)
    return router
  }

  replace(state, path = this) {
    return this.change('replaceState', path, state)
  }

  go(path = this, {replaceState = false, linkProps} = {}) {
    if (typeof path === 'string') {
      path = parsePath(path)
    }
    this.linkProps = linkProps
    return this.change(replaceState ? 'replaceState' : 'pushState', path, {})
  }

  submit({action = this, method = 'GET', data, replaceState = false}) {
    if (typeof action === 'string') {
      action = parsePath(action)
    }
    if (method === 'GET' && data) {
      action.search = '?' + stringifyFormData(data)
    }
    return this.change(
      replaceState ? 'replaceState' : 'pushState',
      action,
      {},
      {
        method,
        data,
      },
    )
  }

  change(pushOrReplace, target, state, {method = 'GET', data = null} = {}) {
    const path = getPath(target)
    const currentPath = getPath(this)
    if (this.xhr) {
      this.xhr.abort()
    }

    if (isHashChange(currentPath, path)) {
      this.changeState('replaceState', state, path)
      // Manually dispatch a `hashchange` event to trigger <Scroll /> behavior on navigation
      // as calling window.history.replaceState does not trigger any navigation events.
      dispatchHashChangeEvent()
      return Promise.resolve()
    }

    const {xhr, getRendererName, getContext, getPushState} = loadPath(path, {
      manifestHash: this.manifestHash,
      headerName: this.headerName,
      method,
      data,
    })

    this.xhr = xhr
    this.events.emit('fetch')

    return Promise.all([getRendererName, getContext, getPushState])
      .then(([rendererName, props, pushStateLocation]) => {
        if (rendererName === null || props === null) {
          this.events.emit('route', this.state)
          return
        }

        target = pushStateLocation ? parsePath(pushStateLocation) : target
        const newPath = pushStateLocation ? getPath(target) : path
        this.changeState(pushOrReplace, {rendererName, props}, newPath)
        this.pathname = target.pathname
        this.search = target.search
        this.events.emit('route', {rendererName, props}, this.linkProps)
        return true
      })
      .catch(err => {
        this.changeState(pushOrReplace, this.state, currentPath)
        this.events.emit('error', err)
      })
  }

  changeState(pushOrReplace, state, path = getPath(this)) {
    this.state = state
    if (pushOrReplace !== 'pushState' || path !== getPath(this)) {
      window.history[pushOrReplace](state, null, path)
    }
  }

  onpopstate(ev) {
    if (!ev.state || !ev.state.rendererName || !ev.state.props) {
      return this.go(window.location)
    }
    this.replace(ev.state, window.location)
  }

  setNavEntry(state) {
    const path = getPath(this)
    this.state = state
    window.history.replaceState(state, null, path)
  }
}

function isHashChange(currentPath, path) {
  const [oldPath] = currentPath.split('#')
  const [newPath, newHash] = path.split('#')

  return oldPath === newPath && newHash
}

function getPath(target) {
  let pathname
  if (typeof target !== 'string') {
    if (target.hasOwnProperty('pathname')) {
      pathname = target.pathname.replace(/\/+/, '/')
      if (target !== window.location) {
        // This function gets passed plain objects with a pathname property,
        // including instances of new Router() but also gets passed
        // window.location directly. if we set window.location.pathname here then
        // we could potentially trigger another popstate event and end up with a
        // Maximum call stack size exceeded error.
        target.pathname = pathname
      }
    }
  } else {
    target = target.replace(/\/+/, '/')
  }

  return typeof target === 'string'
    ? target
    : `${pathname || target.pathname}${target.search || ''}${target.hash || ''}`
}

function stringifyFormData(formData) {
  return [...formData.entries()]
    .filter(([name]) => name !== 'csrftoken')
    .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
    .join('&')
}
