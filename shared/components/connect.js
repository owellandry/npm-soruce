'use strict'

const React = require('react')
const PropTypes = require('prop-types')

/**
 * Use like this:
 *
 * const connect = require('../connect')
 *
 * module.exports = connect()(MyComponent)
 *
 * Your component will then have a props.dispatch() for triggering actions.
 * You can control how the global state object maps to props with the optional
 * `propsMapper` function, e.g.
 *
 * const propsMapper = state => ({myProp: state.someOtherProp})
 * module.exports = connect(propsMapper)(MyComponent)
 *
 * The `propsMapper` function is also passed an `ownProps` object which allows
 * it to access properties of the wrapped component, eg.
 *
 * const propsMapper = (state, ownProps) => ({myProp: state[ownProps.id].someOtherProp})
 *
 * TODO: if we have a propsMapper, disable the update from receiveing new props
 */

module.exports = function connect(propsMapper) {
  return WrappedComponent => {
    class ConnectWrapper extends React.PureComponent {
      constructor(props, context) {
        super(props, context)
        this.state = {}
        this.store = props.store || context.store
        if (propsMapper) {
          const storeState = this.store.getState()
          if (storeState) {
            this.state = propsMapper(storeState, this.props)
          }
          this.unsubscribe = this.store.subscribe(this.onStateChange.bind(this))
        }
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      unsubscribe() {}

      onStateChange() {
        this.setState(propsMapper(this.store.getState(), this.props))
      }

      addExtraProps() {
        return Object.assign(
          {
            dispatch: this.store.dispatch,
          },
          this.props,
          this.state,
        )
      }

      render() {
        return <WrappedComponent {...this.addExtraProps()} />
      }
    }

    Object.keys(WrappedComponent).forEach(key => {
      if (key === 'propTypes') return
      ConnectWrapper[key] = WrappedComponent[key]
    })
    ConnectWrapper.contextTypes = {
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        subscribe: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
      }).isRequired,
    }
    ConnectWrapper.displayName = `ConnectWrapper(${WrappedComponent.name})`
    ConnectWrapper.unwrapped = WrappedComponent.unwrapped || WrappedComponent

    return ConnectWrapper
  }
}
