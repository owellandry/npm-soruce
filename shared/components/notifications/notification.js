'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const connect = require('../connect')
const Link = require('@npm/spiferack/link')
const styles = require('./notifications.css')
const globalStyle = require('../../styles/global.css')

const closeNotification = id => ({type: 'NOTIFICATION_CLOSE', id})

class Notification extends React.PureComponent {
  componentDidMount() {
    const {duration, dispatch, id, autoFocus} = this.props

    if (autoFocus) {
      window.scrollTo(0, 0)
    }

    if (!duration) return

    this.timeout = setTimeout(() => {
      dispatch(closeNotification(id))
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
    const {dispatch, message, level, id, link, autoFocus, closeButtonRef, skipXSSEscaping = false} = this.props
    const levelClass = styles[level]

    const HrefLink = () => {
      return (
        <Link>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.text}
          </a>
        </Link>
      )
    }

    const ActionLink = () => {
      return (
        <button className={globalStyle.clean} onClick={ev => this.dispatchAction(ev)}>
          {link.text}
        </button>
      )
    }

    const linkElem = !link ? null : link.href ? HrefLink() : ActionLink()

    const messageWithLinkSpace = message + (linkElem != null ? ' ' : '')

    // *WARNING* Only skip XSS escaping for trusted, safe, and static messages
    // otherwise, use react's built-in escaping — source: https://shripadk.github.io/react/docs/jsx-gotchas.html
    const componentText = skipXSSEscaping
      ? {dangerouslySetInnerHTML: {__html: messageWithLinkSpace}}
      : {children: messageWithLinkSpace}

    return (
      <div className={`${styles.notification} ${levelClass}`} data-test-id="notification-banner">
        <div style={{display: 'flex'}}>
          <p className="ma0" id="notification" role="alert" aria-atomic="true" {...componentText} />
          {linkElem}
        </div>
        <button
          onClick={() => {
            dispatch(closeNotification(id))
          }}
          aria-label="Close notification"
          className={`${styles.close}`}
          autoFocus={autoFocus}
          ref={closeButtonRef}
        >
          ×
        </button>
      </div>
    )
  }

  static get propTypes() {
    return {
      message: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['error', 'warning', 'success']).isRequired,
      link: PropTypes.shape({
        href: PropTypes.string,
        action: PropTypes.object,
        text: PropTypes.string.isRequired,
      }),
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }
  }
}

module.exports = connect()(Notification)
