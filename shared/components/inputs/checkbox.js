const React = require('react')
const formIdConsumer = require('./form-id-consumer')
const connect = require('../connect')
const PropTypes = require('prop-types')
const types = require('../../types')
const styles = require('../../styles/forms.css')

class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.reflectValidity = this.reflectValidity.bind(this)
  }

  componentDidMount() {
    const {name, formId} = this.props

    const value = this.refs.input.checked

    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value,
    })

    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage: null,
    })
  }

  onChange(ev) {
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: ev.target.checked,
    })
    this.props.onChange && this.props.onChange(ev)
  }

  reflectValidity(e) {
    const {name, formId} = this.props
    const {target} = e
    const valid = target.checkValidity ? target.checkValidity() : true
    const errorMessage = valid ? '' : 'Please check this box if you want to proceed'

    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage,
    })
  }

  render() {
    const {ariaLabel, name, required, label, formId, formData = {}, ariaDescribedby} = this.props
    const {errorMessage, value = false} = formData
    const valid = !errorMessage
    const id = `${formId}_${name}`

    return (
      <div className={styles.checkboxContainer} style={{display: 'block'}}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <input
            id={id}
            ref="input"
            className={styles.checkbox}
            type="checkbox"
            aria-label={ariaLabel}
            name={name}
            checked={value}
            aria-required={required}
            onChange={e => {
              this.onChange(e)
              this.reflectValidity(e)
            }}
            aria-describedby={ariaDescribedby}
          />
          <label className={styles.checkboxLabel} htmlFor={id}>
            {label}
          </label>
        </div>
        {!valid && (
          <p role="alert" aria-label={errorMessage} className={styles.checkboxErrorMessage}>
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
}

Checkbox.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func,
}

module.exports = connect()(formIdConsumer(Checkbox))
