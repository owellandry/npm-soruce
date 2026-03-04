const React = require('react')
const connect = require('../connect')
const formIdConsumer = require('./form-id-consumer')
const PropTypes = require('prop-types')
const types = require('../../types')
const forms = require('../../styles/forms.css')

class RadioInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    if (this.props.value) {
      return
    }

    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: this.getSelectedValue(),
    })
  }

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

  getSelectedValue() {
    const {formData = {}} = this.props
    const {value} = formData
    return value
  }

  rawHtml(text) {
    return {__html: text}
  }

  render() {
    const {label, name, values, formId, initialValue, description, fieldsetClassName = forms.fieldset} = this.props
    // We gave priority to the selected value and In case of initial page load
    // selected value is null and user can pass the initial selected value of radio input.
    const selectedValue = this.getSelectedValue() || initialValue
    const idLabelRadioGroup = `${formId}_${name}_radiogroup_label`
    return (
      <div>
        {label && (
          <p id={idLabelRadioGroup} className={forms.label + ' mb2'}>
            {label}
          </p>
        )}
        {description && <p dangerouslySetInnerHTML={this.rawHtml(description)} className="mt1" />}
        <div role="radiogroup" className={fieldsetClassName} aria-labelledby={idLabelRadioGroup}>
          {values.map(({value, label, text, describedBy, disabled = false}) => {
            const id = `${formId}_${name}_${value}`
            return (
              <div key={id} className={forms.checkboxContainer}>
                <input
                  type="radio"
                  className={forms.radio}
                  aria-labelledby={`${id}_label ${id}_text`}
                  name={name}
                  value={value}
                  id={id}
                  onChange={this.onChange}
                  checked={value === selectedValue}
                  aria-describedby={describedBy}
                  disabled={disabled}
                  aria-disabled={disabled}
                />
                <label htmlFor={id} className={forms.radioLabel} aria-disabled={disabled}>
                  <b id={id + '_label'}>{label}</b>
                  <br />
                  {text && <span id={id + '_text'} dangerouslySetInnerHTML={this.rawHtml(text)} />}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

RadioInput.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  ),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  initialValue: PropTypes.string,
  fieldsetClassName: PropTypes.string,
}

module.exports = connect()(formIdConsumer(RadioInput))
