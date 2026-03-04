'use strict'

const React = require('react')
const types = require('../../types')
const PropTypes = require('prop-types')
const SpiferackForm = require('@npm/spiferack/form')
const FormIdProvider = require('./id-provider')
const HiddenInput = require('../inputs/hidden')
const SubmitButton = require('./submit-button')
const styles = require('../../styles/forms.css')

class GenericForm extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.isInvalid = this.isInvalid.bind(this)
  }

  handleSubmit(e) {
    const valid = e.target.checkValidity ? e.target.checkValidity() : true

    if (!valid) {
      return
    }

    this.props.onSubmit(e)
  }

  isInvalid() {
    let {formData = {}, formId} = this.props
    if (formId) formData = formData[formId] || {}
    return formData.__invalid__
  }

  warnOnUninitialisedFormData() {
    const {formId, formData} = this.props
    const production = process.env.NODE_ENV === 'production'

    if (!production && !formData[formId] && console.warn) {
      const warning = [
        `formData for form ${formId} is uninitialized.`,
        'This can result in unexpected behaviour.',
        'Please make sure formData is initialized in the context',
        "for this page's Spife view.",
      ].join(' ')

      console.warn(warning)
    }
  }

  render() {
    const {
      method = 'POST',
      formId,
      formData,
      action,
      className,
      csrftoken = this.context.csrftoken,
      showButton,
      loading,
      buttonClassName,
      buttonText,
      buttonAriaLabel,
      children,
      noValidate,
      disabled,
      autoComplete,
    } = this.props
    const invalid = this.isInvalid()
    this.warnOnUninitialisedFormData()

    const submitStyle = loading ? `${buttonClassName} ${styles.btnLoading}` : buttonClassName

    return (
      <FormIdProvider formId={formId}>
        <SpiferackForm
          noValidate={noValidate}
          ref="form"
          id={formId}
          method={method}
          action={action}
          className={className}
          onSubmit={e => this.handleSubmit(e)}
          autoComplete={autoComplete}
        >
          {children}
          {csrftoken ? <HiddenInput name="csrftoken" value={csrftoken} formData={formData} /> : null}
          {showButton && (
            <div>
              <SubmitButton
                className={submitStyle}
                disabled={invalid || loading || disabled}
                buttonAriaLabel={buttonAriaLabel}
              >
                {buttonText}
              </SubmitButton>
            </div>
          )}
        </SpiferackForm>
      </FormIdProvider>
    )
  }
}

GenericForm.propTypes = {
  action: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  formData: types.formData.isRequired,
  method: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonClassName: PropTypes.string,
  onSubmit: PropTypes.func,
  noValidate: PropTypes.bool,
  autoComplete: PropTypes.string,
}

GenericForm.defaultProps = {
  className: styles.form,
  showButton: true,
  buttonText: 'Submit',
  onSubmit: SpiferackForm.submit,
  buttonClassName: styles.buttonGradient + ' ' + styles.btnWide,
  noValidate: false,
}

GenericForm.contextTypes = {
  csrftoken: PropTypes.string.isRequired,
}

module.exports = GenericForm
