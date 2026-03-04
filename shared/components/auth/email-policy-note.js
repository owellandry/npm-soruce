'use strict'

const React = require('react')

const styles = require('../../styles/forms.css')

module.exports = function EmailPolicyNote(props) {
  return (
    <p id="email-policy-note" className={`${styles.paragraph} ${props.className || ''}`}>
      Your email address will be added to the metadata of packages that you publish, so it may be seen publicly.
    </p>
  )
}
