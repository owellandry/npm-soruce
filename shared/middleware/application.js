'use strict'

const React = require('react')

const Application = require('../components/application')

module.exports = createApplication

function createApplication() {
  return {
    processRender(props, session, next) {
      return next().then(component => {
        return (
          <Application store={session.store} router={session.router} {...props}>
            {component}
          </Application>
        )
      })
    },
  }
}
