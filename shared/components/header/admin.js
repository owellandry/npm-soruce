'use strict'

const React = require('react')
const Logo = require('./logo')
const Search = require('./search')

const styles = require('./header.css')
const {a11yOnly} = require('../../styles/global.css')

module.exports = function Header(props) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLinks}>
        <div className={styles.headerLinksContainer}>
          <span className={a11yOnly}>npm</span>
          <div className={styles.logo}>
            <Logo />
          </div>
          <Search formData={props.formData} />
        </div>
      </div>
    </header>
  )
}
