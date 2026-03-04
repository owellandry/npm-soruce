'use strict'

const React = require('react')
const PropTypes = require('prop-types')

class Time extends React.PureComponent {
  render() {
    // eslint-disable-next-line es-x/no-array-string-prototype-at
    const {ts, rel} = this.props.at
    const date = new Date(ts)
    if (isNaN(+date)) {
      return ''
    }

    return (
      <time dateTime={date.toISOString()} title={date.toLocaleString()}>
        {rel}
      </time>
    )
  }
}

Time.propTypes = {
  at: PropTypes.shape({
    rel: PropTypes.string.isRequired,
    ts: PropTypes.number.isRequired,
  }).isRequired,
}

module.exports = Time
