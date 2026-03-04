'use strict'

const React = require('react')

// for components that will never update (e.g. always the same static markup)
module.exports = class StaticComponent extends React.Component {
  shouldComponentUpdate() {
    return false
  }
}
