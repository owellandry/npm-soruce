'use strict'
const React = require('react')
const StaticComponent = require('../static')

class ProfileIcon extends StaticComponent {
  render() {
    return (
      <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" aria-hidden="true">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g stroke="#777777" strokeWidth="1.3">
            <g>
              <path d="M13.4044,7.0274 C13.4044,10.5494 10.5494,13.4044 7.0274,13.4044 C3.5054,13.4044 0.6504,10.5494 0.6504,7.0274 C0.6504,3.5054 3.5054,0.6504 7.0274,0.6504 C10.5494,0.6504 13.4044,3.5054 13.4044,7.0274 Z" />
              <path d="M11.4913,11.4913 L17.8683,17.8683" />
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

module.exports = ProfileIcon
