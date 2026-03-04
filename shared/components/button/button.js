const React = require('react')
const PropTypes = require('prop-types')
const Link = require('@npm/spiferack/link')
const styles = require('./button.css')

class Button extends React.Component {
  render() {
    const {children, href, type, classname} = this.props

    return (
      <Link>
        <a href={href} className={`${styles.base} ${classname} ${styles[type]}`}>
          {children}
        </a>
      </Link>
    )
  }
}

Button.defaultProps = {
  className: '',
  buttonType: 'default',
}

Button.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  classname: PropTypes.string,
}

module.exports = Button
