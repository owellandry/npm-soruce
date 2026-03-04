const PropTypes = require('prop-types')
const React = require('react')

const Pagination = require('../../shared/components/pagination/pagination')
const ActionListRow = require('./action-list-row')

const styles = require('./action-list.css')

class ActionList extends React.PureComponent {
  render() {
    const {total = 0, perPage = 10, page = 0, type, url, notice} = this.props
    return (
      <div className="mt3">
        {type && (
          <div className={styles.header}>
            <h2 className={styles.headerText}>
              <span>{`${type}s`}</span>
              <span className={styles.headerTotal}>{total}</span>
            </h2>
            <Pagination page={page} total={total} perPage={perPage} url={url} />
          </div>
        )}
        {notice && (
          <div>
            <p className="mt0 pb0">{notice}</p>
          </div>
        )}
        <div className={styles.actionList} role="list">
          {this.props.children.map(row => {
            return (
              <ActionListRow key={`action-list-${row.key}`} pending={row.pending}>
                {row}
              </ActionListRow>
            )
          })}
        </div>
        <Pagination page={page} total={total} perPage={perPage} url={url} />
      </div>
    )
  }
}

ActionList.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number,
  page: PropTypes.number,
  type: PropTypes.string,
  url: PropTypes.string,
  notice: PropTypes.string,
}

module.exports = ActionList
