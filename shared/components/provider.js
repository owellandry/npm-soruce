'use strict'
const React = require('react')
const PropTypes = require('prop-types')

class Provider extends React.PureComponent {
  getChildContext() {
    return {store: this.props.store, csrftoken: this.props.csrftoken}
  }

  render() {
    return this.props.children
  }
}

Provider.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  csrftoken: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

Provider.childContextTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  csrftoken: PropTypes.string.isRequired,
}

module.exports = Provider
