'use strict'

module.exports = render

const onion = require('./onion')

function render(renderer, props, middleware, session = {}, React) {
  const check = {
    resolve(resp) {
      if (React.isValidElement(resp)) {
        return resp
      }

      return React.createElement(resp, props)
    },
    reject(err) {
      throw err
    },
  }
  return onion(
    middleware,
    (mw, props, session, next) => mw.processRender(props, session, next),
    check,
    () => {
      return React.createElement(renderer, props)
    },
    props,
    session,
  )
}
