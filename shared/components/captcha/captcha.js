const React = require('react')
const styles = require('./captcha.css')
const Spinner = require('../spinner/spinner')
const {CheckIcon} = require('@primer/octicons-react')
const HiddenInput = require('../../components/inputs/hidden')
const types = require('../../types')

class Captcha extends React.Component {
  constructor(props) {
    super(props)
    this.title = 'Please verify by completing this captcha.'
    if (this.props.formId) {
      this.fetchFormData(this.props.formId, this.props.formData)
    }

    this.state = {
      octocaptchaToken: '',
      didCaptchaFailToLoad: false,
    }

    this.loaded = false
    this.captchaTimeout = 30000

    this.octocaptchaSpinner = React.createRef()
    this.octocaptchaSuccess = React.createRef()
    this.octocaptchaFrame = React.createRef()
    this.octocaptchaDiv = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('message', this.onLoad)
    setTimeout(() => this.showFailedCaptchaMessage(), 20000)
    this.octocaptchaFrame.current.addEventListener('error', this.showFailedCaptchaMessage)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onLoad)
    this.octocaptchaFrame.current.addEventListener('error', this.showFailedCaptchaMessage)
  }

  fetchFormData = (formId, formData) => {
    const data = formData[formId] || {}
    this.octocaptchaIFrameURL = data.octocaptchaIFrameURLWithSrcParams
      ? data.octocaptchaIFrameURLWithSrcParams.value
      : ''
    this.octocaptchaURL = data.octocaptchaURL ? data.octocaptchaURL.value : ''
  }

  showCaptcha = (height, width) => {
    if (this.loaded) return
    this.loaded = true

    this.octocaptchaSpinner.current.style.display = 'none'
    this.octocaptchaFrame.current.style.display = 'block'
    this.octocaptchaFrame.current.height = height
    this.octocaptchaFrame.current.width = width
    this.octocaptchaFrame.current.contentWindow.postMessage({event: 'captcha-loaded-ack'}, this.octocaptchaURL)
    const innerIframeForCaptcha = this.octocaptchaFrame.current.contentWindow.document.getElementsByTagName('iframe')[0]
    innerIframeForCaptcha.setAttribute('title', 'Captcha to verify you are a human')
  }

  showFailedCaptchaMessage = () => {
    if (this.loaded) return
    this.showSuccess(true)
  }

  showSuccess = (didCaptchaFailToLoad = false) => {
    if (this.loaded) return
    this.loaded = true

    this.octocaptchaSpinner.current.style.display = 'none'
    this.octocaptchaSuccess.current.style.display = 'block'

    this.setState({didCaptchaFailToLoad})
    this.props.setSubmitButtonDisable(false)
  }

  captchaComplete = token => {
    this.setState({octocaptchaToken: token})
    this.props.setSubmitButtonDisable(false)
  }

  onLoad = e => {
    if (e.origin !== this.octocaptchaURL) {
      return
    }
    const event = e.data && e.data.event
    if (event === 'captcha-loaded') {
      const height = e.data.height || 318
      const width = e.data.width || 400
      this.showCaptcha(height, width)
    } else if (event === 'captcha-complete') {
      this.captchaComplete(e.data.sessionToken)
    } else if (event === 'captcha-suppressed') {
      this.showSuccess()
    }
  }

  render() {
    return (
      <div ref={this.octocaptchaDiv} className={styles.signUpFormCaptcha}>
        <h2 className={styles.captchaHeading}>Verify you are a human</h2>
        <div ref={this.octocaptchaSpinner} className={styles.octocaptchaSpinner}>
          <Spinner color="black" size="32" />
        </div>
        <div ref={this.octocaptchaSuccess} className={styles.octocaptchaSuccess}>
          <CheckIcon size="large" aria-label="Account has been verified. Please continue." />
        </div>
        <div className={styles.loadOctocaptchaFrame}>
          <iframe ref={this.octocaptchaFrame} src={this.octocaptchaIFrameURL} title={this.title} />
        </div>
        <HiddenInput name="octocaptchaToken" value={this.state.octocaptchaToken} formData={this.props.formData} />
        <HiddenInput
          name="errorLoadingCaptcha"
          value={this.state.didCaptchaFailToLoad}
          formData={this.props.formData}
        />
      </div>
    )
  }
}

Captcha.propTypes = {
  formData: types.formDatum.isRequired,
}

module.exports = Captcha
