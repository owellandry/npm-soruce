'use strict'
const React = require('react')

const styles = require('./recovery-codes.css')
const CopyIcon = require('../../components/icons/copy')
const Checkbox = require('../../components/inputs/checkbox')
const DownloadIcon = require('../../components/icons/downloads')
const Form = require('../../components/forms/generic')
const SubmitButton = require('../../components/forms/submit-button')
const LoginRecoveryLockIcon = require('../../components/icons/login-recovery-lock')
const PrinterIcon = require('../../components/icons/printer')
const forms = require('../../styles/forms.css')

function ViewRecoveryCodes({recoveryCodes}) {
  const [copyMessage, setCopyMessage] = React.useState()
  const [forceRerenderKey, setForceRerenderKey] = React.useState(0)

  const copy = async () => {
    setCopyMessage('Recovery codes copied to clipboard')
    setForceRerenderKey(v => v + 1)
    await navigator.clipboard.writeText(recoveryCodes.join('\n'))
  }

  const downloadHref = () => {
    const data = Buffer.from(recoveryCodes.join('\n')).toString('base64')
    return `data:text/plain;base64,${data}`
  }

  const print = () => {
    window.print()
  }

  return (
    <div className="pa3">
      <div className={styles.recoveryCodes} role="button" tabIndex={0}>
        {recoveryCodes.map((code, i) => (
          <p key={i}> {code} </p>
        ))}
      </div>
      <div>
        <div className={styles.recoveryButton}>
          <button
            aria-label="Copy"
            onClick={copy}
            className={`${forms.buttonGradient} ${styles.styleButton} mb0 ml0 flex-grow-1`}
          >
            <CopyIcon /> Copy
          </button>
          <a
            aria-label="Download"
            role="button"
            href={downloadHref()}
            download="npm_recovery_codes.txt"
            className={`${forms.buttonGradient} ${styles.styleButton} mb0 flex-grow-1`}
          >
            <DownloadIcon /> Download
          </a>
          <button
            aria-label="Print"
            onClick={print}
            className={`${forms.buttonGradient} ${styles.styleButton} mb0 flex-grow-1`}
          >
            <PrinterIcon /> Print
          </button>
        </div>
        {copyMessage && (
          <p key={forceRerenderKey} role="alert" className={styles.copyMessage} aria-live="polite">
            <span className="sans-serif" aria-hidden>
              ✓
            </span>
            {copyMessage}
          </p>
        )}
      </div>
    </div>
  )
}

function RegenerateRecoveryCodes(props) {
  const {regenerateUrl, formData} = props
  const [disabled, setDisabled] = React.useState(false)

  return (
    <div className="pa3 bt b1 b--black-20">
      <h3 className={styles.subheading}>Generate New Recovery Codes</h3>
      <p className="ph2 tc">
        When you generate new recovery codes, you must download or print the new codes. Your old codes won’t work
        anymore.
      </p>
      <Form
        action={regenerateUrl}
        method="POST"
        formId="regenerate"
        formData={formData}
        className=""
        showButton={false}
        onSubmit={() => setDisabled(true)}
      >
        <SubmitButton
          className={`${forms.buttonGradient} w-100 mb0 ${disabled ? forms.btnLoading : ''}`}
          disabled={disabled}
        >
          Generate new recovery codes
        </SubmitButton>
      </Form>
    </div>
  )
}

function ConfirmSeen(props) {
  const {voucher, formData, settingsUrl} = props
  const [disabled, setDisabled] = React.useState(true)

  if (voucher) {
    return (
      <Form
        action={`/verify/${voucher.token}`}
        method="POST"
        formId="acceptInvitation"
        formData={formData}
        buttonText="Accept invitation"
        buttonStyle={styles.anchorButton}
        className="ph3 pb3"
      >
        <Checkbox name="confirm" required formData={formData} label="I confirm I have saved my codes" />
      </Form>
    )
  }
  return (
    <Form
      action={settingsUrl}
      method="GET"
      formId="confirm"
      formData={formData}
      buttonText="Go back to settings"
      buttonClassName={`${forms.buttonGradient} w-100 ${forms.buttonGradientGreen}`}
      className="ph3 pb3"
      disabled={disabled}
    >
      <p>Confirm you have saved your codes before proceeding.</p>
      <Checkbox
        name="confirm"
        required
        formData={formData}
        label="I confirm I have saved my codes"
        onChange={e => {
          e.target.checked ? setDisabled(false) : setDisabled(true)
        }}
      />
    </Form>
  )
}

function RecoveryCodesLayout(props) {
  const {title, returnMessage = 'Go back to settings', returnUrl, warning} = props

  const msgRef = React.useCallback(node => {
    // Without the timeout screen readers sometimes do not read the message.
    setTimeout(() => node.focus(), 300)
  }, [])

  return (
    <div className="w-100 mw6 center mv4 tc">
      <h1 className={forms.srOnly}>{title}</h1>
      <div className={styles.container}>
        <div className="pa3">
          <h2 className={styles.heading}>{title}</h2>
          <div className={styles.container}>
            <div className="pa3">
              <div className="mt3 tc">
                <LoginRecoveryLockIcon />
              </div>
              <h3 className={styles.subheading}>Recovery Codes</h3>
              <p className="ph2 mb0 tc" ref={msgRef} tabIndex={-1}>
                {warning}
              </p>
            </div>
            {props.children}
          </div>
        </div>
      </div>
      {returnUrl && (
        <div className="mt4">
          <a href={returnUrl}>{returnMessage}</a>
        </div>
      )}
    </div>
  )
}

RecoveryCodesLayout.layout = 'logoOnly'

function ViewInitialRecoveryCodes(props) {
  return (
    <RecoveryCodesLayout
      title="2FA Successfully Enabled"
      warning="Please make sure you have saved your codes in a secure place before leaving this page."
    >
      <ViewRecoveryCodes {...props} />
      <ConfirmSeen {...props} />
    </RecoveryCodesLayout>
  )
}

function ManageRecoveryCodes(props) {
  if (!props.recoveryCodes) {
    return (
      <RecoveryCodesLayout
        title="Manage Recovery Codes"
        warning="Your existing recovery codes cannot be viewed. Generating new recovery codes will allow you to view them in the future."
        returnUrl={props.settingsUrl}
      >
        <RegenerateRecoveryCodes {...props} />
      </RecoveryCodesLayout>
    )
  }
  return (
    <RecoveryCodesLayout
      title="Manage Recovery Codes"
      warning="Please make sure you have saved your codes in a secure place."
      returnUrl={props.settingsUrl}
    >
      <ViewRecoveryCodes {...props} />
      <RegenerateRecoveryCodes {...props} />
    </RecoveryCodesLayout>
  )
}

module.exports = {
  ManageRecoveryCodes,
  ViewInitialRecoveryCodes,
}
