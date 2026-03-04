'use strict'

const React = require('react')
const MinimalHeader = require('../header/minimal')
const styles = require('./logo-only.css')

module.exports = function LogoOnlyLayout(props) {
  return (
    <div className={styles.container}>
      <MinimalHeader {...props} />
      <main id="main">{props.children}</main>
    </div>
  )
}
