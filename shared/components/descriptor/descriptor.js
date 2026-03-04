const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./descriptor.css')

function Descriptor(props) {
  return (
    <div className={`${styles.container} ${props.className}`}>
      <div className={styles.left}>{props.left}</div>
      <p className={styles.description}>{props.children}</p>
      <div className={styles.right}>{props.right}</div>
    </div>
  )
}

Descriptor.propTypes = {
  className: PropTypes.string,
  left: PropTypes.node,
  children: PropTypes.node,
  right: PropTypes.node,
}

Descriptor.defaultProps = {
  className: '',
}

module.exports = Descriptor
