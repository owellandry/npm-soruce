'use strict'

module.exports = normalize

function normalize(mw) {
  return {
    processRehydrate: mw.processRehydrate || defaultRehydrate,
    processInitial: mw.processInitial || defaultInitial,
    processRender: mw.processRender || defaultRender,
  }
}

function defaultRehydrate(props, session, next) {
  return next()
}

function defaultInitial(props, session, next) {
  return next()
}

function defaultRender(props, session, next) {
  return next()
}
