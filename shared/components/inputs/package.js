'use strict'
const validatePackage = require('validate-npm-package-name')
const React = require('react')
const GenericInput = require('./generic').unwrapped
const connect = require('../connect')
const formIdConsumer = require('./form-id-consumer')
const PropTypes = require('prop-types')
const types = require('../../types')

class PackageInput extends React.Component {
  reflectValidity(ev) {
    const {name, formId} = this.props
    const {
      target,
      target: {value},
    } = ev

    const result = validatePackage(value)
    const errorMessage = result.validForNewPackages ? '' : 'Please enter a valid package name'

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

PackageInput.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  ariaDescribedby: PropTypes.string,
}

PackageInput.defaultProps = {
  label: 'Package',
}

module.exports = connect()(formIdConsumer(PackageInput))
