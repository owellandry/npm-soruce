'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const connect = require('../connect')
const styles = require('./alert-banner.css')

const closeAlertBanner = id => ({type: 'ALERT_BANNER_CLOSE', id})

const getIconForLevel = level => {
  switch (level) {
    case 'warning':
      return '⚠️'
    case 'error':
      return '❌'
    case 'success':
      return '✅'
    case 'info':
      return 'ℹ️'
    default:
      return null
  }
}

class AlertBanner extends React.PureComponent {
  componentDidMount() {
    const {duration, dispatch, id, autoFocus} = this.props

    if (autoFocus) {
      window.scrollTo(0, 0)
    }

    if (!duration) return

    this.timeout = setTimeout(() => {
      dispatch(closeAlertBanner(id))
    }, duration)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  dispatchAction(ev) {
    const {link, dispatch} = this.props
    ev.preventDefault()
    dispatch(link.action)
  }

  render() {
    const {
      dispatch,
      message,
      level = 'success',
      id,
      link,
      autoFocus,
      closeButtonRef,
      skipXSSEscaping = false,
    } = this.props

    const levelClass = styles[level]
    const icon = getIconForLevel(level)

    const HrefLink = () => {
      return (
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {link.text}
        </a>
      )
    }

    const ActionLink = () => {
      return (
        <button className={styles.alertBannerLinkButton} onClick={ev => this.dispatchAction(ev)}>
          {link.text}
        </button>
      )
    }

    const linkElem = !link ? null : link.href ? HrefLink() : ActionLink()

    // *WARNING* Only skip XSS escaping for trusted, safe, and static messages
    // otherwise, use react's built-in escaping
    const componentText = skipXSSEscaping ? {dangerouslySetInnerHTML: {__html: message}} : {children: message}

    return (
      <div className={styles.alertBannerContainer}>
        <div className={styles.alertBannerWrapper}>
          <div className={`${styles.alertBanner} ${levelClass}`} data-test-id="alert-banner">
            {icon && <span className={styles.alertBannerIcon}>{icon}</span>}
            <div className={styles.alertBannerContent}>
              <p className="ma0" id="banner-notification" role="alert" aria-atomic="true" {...componentText} />
              {linkElem}
            </div>
            <button
              onClick={() => {
                dispatch(closeAlertBanner(id))
              }}
              aria-label="Close notification"
              className={styles.alertBannerCloseButton}
              autoFocus={autoFocus}
              ref={closeButtonRef}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    )
  }
}

AlertBanner.propTypes = {
  // Required props
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  // Optional props
  link: PropTypes.shape({
    href: PropTypes.string,
    action: PropTypes.object,
    text: PropTypes.string.isRequired,
  }),
  duration: PropTypes.number,
  autoFocus: PropTypes.bool,
  closeButtonRef: PropTypes.func,
  skipXSSEscaping: PropTypes.bool,
}

AlertBanner.defaultProps = {
  level: 'success',
  autoFocus: false,
  skipXSSEscaping: false,
}

module.exports = connect()(AlertBanner)
