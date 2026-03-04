'use strict'
const React = require('react')
const StaticComponent = require('../static')

class GreenTickIcon extends StaticComponent {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
        <path
          d="M4.07573 9.29842L0.175729 5.39842C-0.0585762 5.16412 -0.0585762 4.78422 0.175729 4.54989L1.02424 3.70136C1.25854 3.46703 1.63846 3.46703 1.87277 3.70136L4.49999 6.32856L10.1272 0.701363C10.3615 0.467059 10.7414 0.467059 10.9758 0.701363L11.8243 1.54989C12.0586 1.7842 12.0586 2.1641 11.8243 2.39842L4.92426 9.29844C4.68993 9.53275 4.31003 9.53275 4.07573 9.29842Z"
          fill="#107010"
        />
      </svg>
    )
  }
}

module.exports = GreenTickIcon
