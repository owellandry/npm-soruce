'use strict'
const React = require('react')
const PropTypes = require('prop-types')

class IdProvider extends React.PureComponent {
  getChildContext() {
    return {formId: this.props.formId}
  }

  render() {
    return this.props.children
  }
}

IdProvider.childContextTypes = {
  formId: PropTypes.string.isRequired,
}

module.exports = IdProvider
