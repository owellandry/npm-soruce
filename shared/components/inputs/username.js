'use strict'
const isInvalid = require('npm-user-validate').username
const React = require('react')
const connect = require('../connect')
const GenericInput = require('./generic').unwrapped
const formIdConsumer = require('./form-id-consumer')
const PropTypes = require('prop-types')
const types = require('../../types')

class UsernameInput extends React.Component {
  componentDidUpdate(prevProps) {
    const {name, formId, errorMessage} = this.props
    if (errorMessage !== prevProps.errorMessage) {
      this.props.dispatch({
        type: 'FORM_VALIDITY_CHECK',
        name,
        formId,
        errorMessage,
      })
    }
  }

  reflectValidity(ev) {
    const {name, formId} = this.props
    const {
      target,
      target: {value},
    } = ev
    let errorMessage

    if (value) {
      // return an actionable error message if the user entered an email address
      // npm-user-validate forbids @, but the error message is not clear ("Name may not contain non-url-safe chars")
      if (value.includes('@')) {
        errorMessage = 'Username cannot include @. Please provide a username, not an email address.'
      } else {
        const err = isInvalid(value)
        errorMessage = err ? err.message : ''
      }
    }

    target.setCustomValidity && target.setCustomValidity(errorMessage)

    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage,
    })
  }

  render() {
    return <GenericInput {...this.props} required onBlur={ev => this.reflectValidity(ev)} />
  }
}

UsernameInput.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func,
  roleName: PropTypes.string,
  'aria-expanded': PropTypes.string,
}

UsernameInput.defaultProps = {
  label: 'Username',
}

module.exports = connect()(formIdConsumer(UsernameInput))
