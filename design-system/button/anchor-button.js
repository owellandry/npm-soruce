'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./button.css')

const Link = require('@npm/spiferack/link')

class AnchorButton extends React.PureComponent {
  render() {
    const {children, leftIcon, rightIcon, href, onClick, className} = this.props
    const classes = `${styles.wrapper} ${className}`
    const anchor = (
      <a href={href} onClick={ev => this.onClick(ev)} className={classes}>
        {leftIcon}
        <span className={styles.text}>{children}</span>
        {rightIcon}
      </a>
    )
    return onClick ? anchor : <Link>{anchor}</Link>
  }

  onClick(ev) {
    this.props.onClick && this.props.onClick(ev)
  }
}

AnchorButton.defaultProps = {
  className: '',
}

AnchorButton.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

module.exports = AnchorButton
