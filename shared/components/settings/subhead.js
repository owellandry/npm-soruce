'use strict'

const React = require('react')
const styles = require('./subhead.css')
const PropTypes = require('prop-types')

class SettingsSubhead extends React.PureComponent {
  render() {
    const {scope} = this.props

    return (
      <div className={styles.subheadCard}>
        <p className={styles.title}>{scope.parent.name}</p>
      </div>
    )
  }
}

SettingsSubhead.propTypes = {
  scope: PropTypes.object.isRequired,
}

module.exports = SettingsSubhead
