const React = require('react')
const PropTypes = require('prop-types')
const _ = require('lodash')
const types = require('../../types')
const Input = require('./semi-controlled')
const formIdConsumer = require('./form-id-consumer')
const connect = require('../connect')
const forms = require('../../styles/forms.css')
const {a11yOnly} = require('../../styles/global.css')

class GenericInput extends React.PureComponent {
  onChange(ev) {
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: ev.target.value,
    })
    this.props.onChange && this.props.onChange(ev)
  }

  componentDidMount() {
    const inputRef = this.props.inputRef || 'input'
    const valueObtainedFromRef = _.get(this.refs, [inputRef, 'value'])
    if (this.props.value || valueObtainedFromRef) {
      return
    }
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage: null,
    })
  }

  render() {
    const {
      a11yOnlyLabel,
      autoComplete,
      className,
      textboxClassName,
      formData,
      icon,
      label,
      name,
      type,
      roleName,
      autoFocus,
      onBlur,
      onKeyUp,
      onKeyDown,
      onFocus,
      placeholder,
      inline,
      readonly,
      required,
      minLength,
      maxLength,
      disabled,
      inputMode,
      initialValue,
      inputref,
      isMandatory,
      isAlertErrorMessage = true,
      errorInLabel = true,
      trailingElement = null,
      ariaLabelledBy,
      ariaDescribedby,
      labelDetails,
    } = this.props
    const {value = initialValue, errorMessage} = formData
    const valid = !errorMessage
    const id = this.props.formId + '_' + name
    const errorMessageRole = isAlertErrorMessage ? 'alert' : undefined

    const containerClass = className + (inline ? ` ${forms.inline}` : '')
    const inputClass = `${textboxClassName || ''} ${inline ? forms.textInputInline : forms.textInput}`
    const labelClass = inline ? forms.labelInline : forms.label
    const errorClass = inline ? forms.errorMessageInline : forms.errorMessage
    const errorId = errorMessage ? `${id}_error_message` : undefined
    const labelDetailsClass = inline ? forms.labelDetailsInline : forms.labelDetails

    return (
      <div className={`${containerClass}`}>
        <div className={`${icon ? forms.inputHasIcon : ''} nowrap flex justify-between`}>
          {label && (
            <label id={`${label}Id`} className={`${labelClass} ${a11yOnlyLabel ? a11yOnly : ''}`} htmlFor={id}>
              {label}
              {isMandatory && <abbr>*</abbr>}
            </label>
          )}
          {icon && <div className="pt1">{icon}</div>}
        </div>
        <div>{labelDetails && <span className={`${labelDetailsClass}`}>{labelDetails}</span>}</div>
        <Input
          autoFocus={autoFocus}
          id={id}
          aria-label={this.props['aria-label']}
          aria-required={this.props['aria-required']}
          aria-invalid={!valid}
          aria-describedby={[ariaDescribedby, errorId].filter(Boolean).join(' ') || undefined}
          aria-activedescendant={this.props['aria-activedescendant']}
          aria-expanded={this.props['aria-expanded']}
          type={type}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`${inputClass}  ${valid ? '' : forms.invalid}`}
          onChange={ev => this.onChange(ev)}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onFocus={onFocus}
          name={name}
          value={value}
          readOnly={readonly}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          inputref={inputref}
          trailingElement={trailingElement}
          roleName={roleName}
          aria-labelledby={ariaLabelledBy}
          labelDetails={labelDetails}
        />
        {errorMessage &&
          (errorInLabel ? (
            <p id={errorId} className={errorClass} role={errorMessageRole}>
              {errorMessage}
            </p>
          ) : (
            <p id={errorId} className={errorClass} role={errorMessageRole}>
              {errorMessage}
            </p>
          ))}
      </div>
    )
  }
}

GenericInput.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
  formData: types.formDatum.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  className: PropTypes.string,
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  a11yOnlylabel: PropTypes.bool,
  autoFocus: PropTypes.bool,
  isMandatory: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  labelDetails: PropTypes.node,
}

GenericInput.defaultProps = {
  formData: {
    value: '',
  },
  type: 'text',
  className: '',
  inline: false,
  placeholder: '',
  a11yOnlyLabel: false,
  required: false,
  autoFocus: false,
  isMandatory: false,
}

module.exports = connect()(formIdConsumer(GenericInput))
