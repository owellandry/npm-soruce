'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const styles = require('../../styles/forms.css')

class SubmitButton extends React.PureComponent {
  render() {
    const {children, className, disabled, buttonAriaLabel} = this.props

    return (
      <button
        type="submit"
        className={disabled ? `${className} ${styles.buttonDisabled}` : className}
        aria-label={buttonAriaLabel}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
}

SubmitButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  disabled: PropTypes.bool,
}

SubmitButton.defaultProps = {
  children: 'Submit',
  className: styles.buttonGradient,
}

module.exports = SubmitButton
