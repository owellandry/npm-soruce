'use strict'

const Link = require('@npm/spiferack/link')
const React = require('react')

module.exports = function PasswordCriteria(props) {
  const msg = props.message || 'Your password should be at least 10 characters and must meet our '
  return (
    <p id="password-criteria" className={`${props.className || ''}`}>
      {msg}{' '}
      <Link>
        <a style={{fontWeight: 'unset'}} target="_blank" href="https://docs.npmjs.com/creating-a-strong-password">
          password guidelines
        </a>
      </Link>
      {props.message ? '' : '.'}
    </p>
  )
}
