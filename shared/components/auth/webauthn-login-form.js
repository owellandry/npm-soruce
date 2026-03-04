'use strict'

const React = require('react')
const Router = require('@npm/spiferack/shared/router')
const PropTypes = require('prop-types')
const {get} = require('@github/webauthn-json')
const {Helmet} = require('react-helmet')
const CooldownOptin = require('./cooldown-optin')

const styles = require('./auth.css')
const btnStyles = require('../../styles/forms.css')
const LoginLockIcon = require('../icons/login-lock')

class WebAuthnLoginForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: 'Use security key',
      disabled: false,
      errorCount: 0,
      didOptForCooldown: false,
    }

    this.processCooldownOptIn = this.processCooldownOptIn.bind(this)
  }

  processCooldownOptIn(cooldownChecked) {
    this.setState({
      didOptForCooldown: cooldownChecked,
    })
  }

  render() {
    const {
      publicKeyCredentialRequestOptions,
      csrftoken,
      action,
      errorCount,
      isTfaEscalation,
      isNewPublishAuthEscalation,
      isNewPasswordResetFlowEscalation,
      originalUrl,
    } = this.props

    if (this.state.errorCount < errorCount) {
      this.setState({
        text: 'Use security key',
        disabled: false,
        errorCount,
      })
    }
    let buttonClassName = btnStyles.buttonGradient + ' ' + btnStyles.btnWide
    if (this.state.disabled) {
      buttonClassName += ' ' + btnStyles.btnLoading
    }
    return (
      <div className={styles.login}>
        <Helmet>
          <title>npm | Security Key</title>
        </Helmet>
        <div style={{textAlign: 'center'}}>
          <LoginLockIcon />
        </div>
        <h2 style={{textAlign: 'center'}}>Security key</h2>
        <p>Click the button below when you are ready to authenticate.</p>
        <CooldownOptin {...this.props} onCooldownOptinChange={this.processCooldownOptIn} />
        <button
          disabled={this.state.disabled}
          onClick={() =>
            this.verifyWebAuthnLogin(
              publicKeyCredentialRequestOptions,
              csrftoken,
              action,
              isTfaEscalation,
              isNewPublishAuthEscalation,
              isNewPasswordResetFlowEscalation,
              originalUrl,
            )
          }
          className={buttonClassName}
        >
          {this.state.text}
        </button>
      </div>
    )
  }

  async verifyWebAuthnLogin(
    publicKeyCredentialRequestOptions,
    csrftoken,
    action,
    isTfaEscalation,
    isNewPublishAuthEscalation,
    isNewPasswordResetFlowEscalation,
    originalUrl,
  ) {
    const assertion = await get({
      publicKey: {
        rp: window.location.hostname,
        ...publicKeyCredentialRequestOptions,
      },
    })

    this.setState({text: 'Verifying...', disabled: true})

    const data = {
      formName: 'webauthn',
      isTfaEscalation,
      isNewPublishAuthEscalation,
      isNewPasswordResetFlowEscalation,
      webAuthnAssertion: assertion,
      didOptForCooldown: this.state.didOptForCooldown,
      originalUrl,
      csrftoken,
      errorCount: this.state.errorCount,
    }

    Router.get().submit({
      action,
      method: 'POST',
      data,
    })
  }
}

WebAuthnLoginForm.propTypes = {
  errorCount: PropTypes.number.isRequired,
  action: PropTypes.string,
}

module.exports = WebAuthnLoginForm
