'use strict'

const React = require('react')
const Logo = require('./logo')

const styles = require('./minimal.css')
const {a11yOnly} = require('../../styles/global.css')

module.exports = function MinimalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLinksContainer}>
        <div className={styles.logo}>
          <Logo />
        </div>
      </div>
    </header>
  )
}
