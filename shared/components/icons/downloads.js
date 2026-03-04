'use strict'
const React = require('react')
const StaticComponent = require('../static')

class DownloadsIcon extends StaticComponent {
  render() {
    return (
      <svg viewBox="0 0 7.22 11.76" aria-hidden="true">
        <title>Downloads</title>
        <g>
          <polygon
            points="4.59 4.94 4.59 0 2.62 0 2.62 4.94 0 4.94 3.28 9.53 7.22 4.94 4.59 4.94"
            aria-label="Downloads icon"
          />
          <rect x="0.11" y="10.76" width="7" height="1" />
        </g>
      </svg>
    )
  }
}

module.exports = DownloadsIcon
