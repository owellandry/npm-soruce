const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./button.css')

class FormButton extends React.PureComponent {
  render() {
    const {ariaLabel = 'Form', children, leftIcon, rightIcon, className, type, disabled, title, ...rest} = this.props
    const classes = `${styles.wrapper} ${className || ''}`
    return (
      <button
        onClick={ev => this.onClick(ev)}
        className={classes}
        disabled={disabled}
        type={type}
        {...rest}
        aria-label={ariaLabel}
      >
        {leftIcon}
        <span className={styles.text}>{children}</span>
        {rightIcon}
      </button>
    )
  }

  onClick(ev) {
    this.props.onClick && this.props.onClick(ev)
  }
}

FormButton.defaultProps = {
  onClick: () => {},
  type: 'button',
}

FormButton.propTypes = {
  children: PropTypes.node.isRequired,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
}

module.exports = FormButton
