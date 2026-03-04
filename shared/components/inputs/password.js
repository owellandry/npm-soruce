const React = require('react')
const formIdConsumer = require('./form-id-consumer')
const connect = require('../connect')
const GenericInput = require('./generic').unwrapped
const PropTypes = require('prop-types')
const types = require('../../types')
const styles = require('../../../shared/styles/forms.css')

class PasswordInput extends React.Component {
  constructor(props) {
    super(props)
    this.passwordRef = React.createRef()
    this.state = {
      passwordVisibility: false,
    }
  }

  reflectValidity(e) {
    const {name, formId, minLength} = this.props
    const {target} = e
    const valid = target.checkValidity ? target.checkValidity() : true
    const errorMessage = valid
      ? ''
      : Number(minLength)
        ? `Please enter a valid password that is at least ${minLength} characters`
        : 'Please enter a password'

    this.props.dispatch({
      type: 'FORM_VALIDITY_CHECK',
      name,
      formId,
      errorMessage,
    })
  }

  onBlurHandler(e) {
    const {onBlur} = this.props
    this.reflectValidity(e)
    onBlur(e)
  }

  togglePasswordVisibility(e) {
    e.preventDefault()
    console.log(e.currentTarget.name)
    console.log(e.target.name)
    this.setState({passwordVisibility: !this.state.passwordVisibility}, () => {
      this.passwordRef.current.focus()
    })
  }

  render() {
    const {passwordVisibility} = this.state
    const {showToggleButton} = this.props
    const typeInput = passwordVisibility ? 'input' : 'password'
    return (
      <GenericInput
        {...this.props}
        type={typeInput}
        inputref={this.passwordRef}
        onBlur={ev => this.onBlurHandler(ev)}
        onChange={ev => this.reflectValidity(ev)}
        textboxClassName={showToggleButton ? styles.showHidePasswordInput : ''}
        trailingElement={
          showToggleButton ? (
            <ShowHideButton visible={passwordVisibility} onClick={ev => this.togglePasswordVisibility(ev)} />
          ) : null
        }
      />
    )
  }
}

function ShowHideButton({onClick, visible}) {
  return (
    <button
      name="show-hide-password"
      type="button"
      aria-label={visible ? 'Hide password' : 'Show password'}
      className={styles.showHidePasswordButton}
      onClick={onClick}
    >
      {visible ? 'Hide' : 'Show'}
    </button>
  )
}

PasswordInput.propTypes = {
  formId: PropTypes.string,
  formData: types.formDatum,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  showToggleButton: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
}

PasswordInput.defaultProps = {
  label: 'Password',
  minLength: '10',
  required: true,
  onBlur: () => {},
  onChange: () => {},
  showToggleButton: false,
}

module.exports = connect()(formIdConsumer(PasswordInput))
