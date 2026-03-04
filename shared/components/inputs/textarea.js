'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const Input = require('./semi-controlled')
const formIdConsumer = require('./form-id-consumer')
const connect = require('../connect')
const forms = require('../../styles/forms.css')
const {a11yOnly} = require('../../styles/global.css')

class Textarea extends React.PureComponent {
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

  render() {
    const {
      a11yOnlyLabel,
      className,
      formData,
      icon,
      label,
      name,
      onBlur,
      required,
      placeholder,
      textboxClass,
      inputref,
      ariaDescribedby,
      ariaInvalid = false,
    } = this.props
    const {value} = formData
    return (
      <div className={`${className} ${icon && forms.inputHasIcon}`}>
        <label style={{whiteSpace: 'normal'}} className={`${forms.label} ${a11yOnlyLabel && a11yOnly}`} htmlFor={name}>
          {label}
        </label>
        {icon ? <span className={forms.icon}>{icon}</span> : null}
        <Input
          element="textarea"
          type="text"
          required={required}
          className={textboxClass || forms.textInput}
          onChange={ev => this.onChange(ev)}
          onBlur={onBlur}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          inputref={inputref}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
        />
      </div>
    )
  }
}

Textarea.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  formData: types.formDatum.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  className: PropTypes.string,
  a11yOnlylabel: PropTypes.bool,
}

Textarea.defaultProps = {
  formData: {
    value: '',
  },
  className: '',
  a11yOnlyLabel: false,
  required: false,
}

module.exports = connect()(formIdConsumer(Textarea))
