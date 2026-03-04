'use strict'
const React = require('react')
const StaticComponent = require('../static')

class XIcon extends StaticComponent {
  render() {
    return (
      <svg
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon
          style={{fill: 'currentColor'}}
          points="16 1.53206865 14.4679313 0 8.00722674 6.47515808 1.53206865 0 0 1.53206865 6.47515808 8.00722674 0 14.4679313 1.53206865 16 8.00722674 9.53929539 14.4679313 16 16 14.4679313 9.53929539 8.00722674"
        />
      </svg>
    )
  }
}

module.exports = XIcon
