'use strict'

module.exports = createProcessMW

function createProcessMW() {
  return {
    processRehydrate(props, session, next) {
      window.process = window.process || {}
      addProcessEmitter(process)
      return next()
    },
  }
}

function addProcessEmitter(process) {
  const listeners = {}
  Object.assign(process, {
    on(what, fn) {
      listeners[what] = listeners[what] || []
      listeners[what].push(fn)
      return process
    },
    removeListener(what, fn) {
      const arr = listeners[what]
      if (!arr) {
        return
      }
      listeners[what] = arr.filter(xs => xs !== fn)
    },
    emit(what, ...args) {
      const arr = listeners[what]
      if (!arr) {
        return 0
      }
      arr.map(xs => xs.call(process, ...args))
      return arr.length
    },
  })
}
