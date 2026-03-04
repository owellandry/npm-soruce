'use strict'

const React = require('react')
const StaticComponent = require('../static')
const Link = require('@npm/spiferack/link')

module.exports = class Logo extends StaticComponent {
  render() {
    const color = this.props.color || '#231F20'
    return (
      <Link>
        <a href="/" aria-label="Npm">
          <svg viewBox="0 0 780 250" aria-hidden="true">
            <path
              fill={color}
              d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z
     M0,200h100V50h50v150h50V0H0V200z"
              stroke-width="5"
              stroke="#f7f7f7"
            />
          </svg>
        </a>
      </Link>
    )
  }
}
