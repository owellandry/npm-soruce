'use strict'

module.exports = render

const ReactDOM = require('react-dom')
const React = require('react')
const debounce = require('p-debounce')
// const debounce = a => a
const baseRender = debounce(require('../shared/render'), 0)

function render(container, renderer, props, middleware, session) {
  return baseRender(renderer, props, middleware, session, React).then(body => {
    ReactDOM.hydrate(body, container)
  })
}
