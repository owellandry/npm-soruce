'use strict'

const React = require('react')
const ProductNav = require('./product-nav')
const Logo = require('./logo')
const User = require('./user')
const Search = require('./search')

const styles = require('./header.css')
const {a11yOnly} = require('../../styles/global.css')

module.exports = function Header(props) {
  const skips = [
    {name: 'content', id: 'main'},
    {name: 'package search', id: 'search'},
  ]
  if (!props.user) {
    skips.push({name: 'sign in', id: 'signin'})
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerGakbar} />

      <div className={styles.headerMain}>
        <div id="header" className={styles.skipToLinkHeader}>
          skip to:
          {skips.map(s => (
            <a aria-label={`skip to ${s.name}`} className={styles.skipLink} key={s.id} href={`#${s.id}`}>
              {s.name}
            </a>
          ))}
        </div>
        <div className={styles.headerMainContainer}>
          <span className={`${styles.firstPublish}`}>❤</span>
          <ProductNav />
        </div>
      </div>

      <div className={styles.headerLinks}>
        <div className={styles.headerLinksContainer}>
          <span className={a11yOnly}>npm</span>
          <div className={styles.logo}>
            <Logo />
          </div>
          <Search formData={props.formData} />
          <User user={props.user} userDropdownOpen={props.userDropdownOpen} auditLogEnabled={props.auditLogEnabled} />
        </div>
      </div>
    </header>
  )
}
