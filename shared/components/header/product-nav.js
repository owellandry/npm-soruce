'use strict'

const React = require('react')
const styles = require('./header.css')

module.exports = class ProductNav extends React.Component {
  render() {
    return (
      <nav className={styles.productNav} aria-label="Product Navigation">
        <ul id="main-menu" className="list pl0">
          <li className="dib">
            <a href="/products/pro" className={`${styles.productNavLink} dim pr2 pl2`} id="nav-pro-link">
              Pro
            </a>
          </li>
          <li className="dib">
            <a href="/products/teams" className={`${styles.productNavLink} dim pr2 pl2`} id="nav-teams-link">
              Teams
            </a>
          </li>
          <li className="dib">
            <a href="/products" className={`${styles.productNavLink} dim pr2 pl2`} id="nav-pricing-link">
              Pricing
            </a>
          </li>
          <li className="dib">
            <a href="https://docs.npmjs.com" className={`${styles.productNavLink} dim pr2 pl2`} id="nav-docs-link">
              Documentation
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
