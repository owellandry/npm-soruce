'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./tfa-table.css')
class TfaTable extends React.PureComponent {
  render() {
    const {headings, rows, useHeadings, ariaLabel = ''} = this.props
    return (
      <div>
        <table aria-label={ariaLabel} className={styles.table}>
          {useHeadings && <TableHead headings={headings} />}
          <tbody>
            {rows.map((row, index) => (
              <TableRow index={index} row={row} key={row.key} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

function TableHead(props) {
  const headings = props.headings
  return (
    <thead>
      <tr>
        <th scope="col" className={`${styles.tableHead} ${styles.firstColumn}`} key={'head-cell-1'}>
          {headings[0]}
        </th>
        <th scope="col" className={`${styles.tableHead} ${styles.secondColumn}`} key={'head-cell-2'}>
          {headings[1]}
        </th>
        <th scope="col" className={`${styles.tableHead} ${styles.thirdColumn}`} key={'head-cell-3'}>
          {headings[2]}
        </th>
      </tr>
    </thead>
  )
}

function TableRow(props) {
  const {row} = props
  const {cells, key} = row
  return (
    <tr key={key} className={styles.tableRow}>
      <td className={`${styles.cell} ${styles.firstColumn}`} key={`${key}-cell-1`}>
        {cells[0]}
      </td>
      <td className={`${styles.cell} ${styles.secondColumn}`} key={`${key}-cell-2`}>
        {cells[1]}
      </td>
      <td className={`${styles.cell} ${styles.thirdColumn}`} key={`${key}-cell-3`}>
        {cells[2]}
      </td>
    </tr>
  )
}

TfaTable.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.node),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cells: PropTypes.arrayOf(PropTypes.node),
    }),
  ),
  useHeadings: PropTypes.bool,
}

TfaTable.defaultProps = {
  headings: [],
  rows: [],
  useHeadings: true,
}

module.exports = TfaTable
