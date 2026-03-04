const React = require('react')
const connect = require('../connect')
const formIdConsumer = require('./form-id-consumer')
const GenericInput = require('./generic').unwrapped
const PropTypes = require('prop-types')
const types = require('../../types')

class EmailInput extends React.Component {
  reflectValidity(e) {
    const {name, formId} = this.props
    const {target} = e
    const valid = target.checkValidity ? target.checkValidity() : true
    const errorMessage = valid
      ? ''
      : target.value === '' || !target.validationMessage
        ? 'Please enter a valid email'
        : target.validationMessage

    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage,
    })
  }

  render() {
    return <GenericInput {...this.props} type="email" required onBlur={ev => this.reflectValidity(ev)} />
  }
}

EmailInput.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
}

EmailInput.defaultProps = {
  label: 'Email',
  reaonly: false,
}

module.exports = connect()(formIdConsumer(EmailInput))
