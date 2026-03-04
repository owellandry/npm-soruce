'use strict'

const React = require('react')
const StaticComponent = require('../static')
const styles = require('./spinner.css')

module.exports = class Spinner extends StaticComponent {
  render() {
    const {className, color, size} = this.props
    return (
      <svg
        style={{
          boxSizing: 'content-box',
          color: color || 'red',
          verticalAlign: 'top',
        }}
        viewBox="0 0 16 16"
        fill="none"
        width={size || '20'}
        height={size || '20'}
        className={[styles.animate, className].join(' ')}
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M15 8a7.002 7.002 0 00-7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }
}
