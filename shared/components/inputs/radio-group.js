const React = require('react')
const connect = require('../connect')
const formIdConsumer = require('./form-id-consumer')
const PropTypes = require('prop-types')
const types = require('../../types')
const forms = require('../../styles/forms.css')

class RadioGroup extends React.PureComponent {
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
    const {values, formData = {}} = this.props
    const {value = values[0].value} = formData
    return value
  }

  render() {
    const {label, name, values, formId, initialValue} = this.props
    const selectedValue = initialValue || this.getSelectedValue()
    return (
      <div>
        {label && <p className={forms.emphasis}>{label}</p>}
        <fieldset className={'bn pa0 ma0'}>
          <div className={forms.radioGroupControls}>
            {values.map(({value, label}) => {
              const id = `${formId}_${name}_${value}`
              const checked = value === selectedValue
              return (
                <div key={id} className={`${forms.radioGroupButton} ${checked ? forms.radioGroupButtonChecked : ''}`}>
                  <input type="radio" name={name} value={value} id={id} onChange={this.onChange} checked={checked} />
                  <label htmlFor={id} className={forms.radioGroupLabel}>
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
        </fieldset>
      </div>
    )
  }
}

RadioGroup.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  initialValue: PropTypes.string,
}

module.exports = connect()(formIdConsumer(RadioGroup))
