const PropTypes = require('prop-types')
const React = require('react')

const styles = require('./action-list.css')

class ActionListRow extends React.PureComponent {
  render() {
    const {pending} = this.props
    return (
      <div className={`${styles.row} ${pending ? 'o-50' : ''}`} role="listitem">
        {this.props.children}
      </div>
    )
  }
}

ActionListRow.propTypes = {
  pending: PropTypes.bool,
}

module.exports = ActionListRow
