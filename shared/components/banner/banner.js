const React = require('react')
const styles = require('./banner.css')
const globalStyles = require('../../styles/global.css')
const PropTypes = require('prop-types')
const CallToAction = require('../call-to-action/call-to-action')

class Banner extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      show: true,
    }

    this.close = this.close.bind(this)
  }

  close() {
    this.setState({show: false})
    this.props.onDismiss.call(this)
  }

  render() {
    const {backgroundColor = 'gray', onAction, text, iconName, buttonCaption, onDismiss} = this.props

    return this.state.show ? (
      <div className={[styles.banner, styles[backgroundColor]].join(' ')}>
        {onAction ? (
          <CallToAction text={text} buttonCaption={buttonCaption} iconName={iconName} onClick={onAction} />
        ) : (
          <div className={styles.bannerContent}>
            <p className="ma0">{text}</p>
            {onDismiss ? (
              <button
                aria-label="Close notification"
                className={`${globalStyles.clean} ${styles.close}`}
                onClick={this.close}
              >
                ×
              </button>
            ) : null}
          </div>
        )}
        {this.props.children}
      </div>
    ) : null
  }
}

Banner.propTypes = {
  backgroundColor: PropTypes.oneOf(['gray', 'white', 'yellow']),
  callToAction: function (props) {
    if (props.onAction && !props.buttonCaption) {
      return new Error('both "buttonCaption" are required when using "onAction"')
    }
    return null
  },
  onAction: PropTypes.func,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  iconName: PropTypes.string,
  onDismiss: PropTypes.func,
  children: PropTypes.element,
}

module.exports = Banner
