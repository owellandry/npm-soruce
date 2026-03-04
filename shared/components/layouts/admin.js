'use strict'

const React = require('react')
const Header = require('../header/admin.js')
const headerStyles = require('../header/header.css')
const Footer = require('../footer')
const styles = require('../settings/container.css')

function AdminLayout(props) {
  return (
    <div className={headerStyles.settingsLayout}>
      <Header {...props} />
      <main id="main">
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.content}>{props.children}</div>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  )
}

module.exports = AdminLayout
