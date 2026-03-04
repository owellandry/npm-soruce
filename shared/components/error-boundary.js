'use strict'

const React = require('react')

const connect = require('./connect')

class ErrorBoundary extends React.PureComponent {
  componentDidCatch(error) {
    this.props.dispatch('COMPONENT_ERROR', {error})
  }

  render() {
    if (this.props.componentError) {
      return (
        <div>
          <h1>Caught React Error</h1>
          <details>
            <summary>Stack</summary>
            <pre>{this.props.componentError}</pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

module.exports = connect()(ErrorBoundary)
