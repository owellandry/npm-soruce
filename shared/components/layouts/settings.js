'use strict'
const React = require('react')
const Header = require('../header')
const headerStyles = require('../header/header.css')
const Footer = require('../footer')
const Sidebar = require('../settings/sidebar')
const styles = require('../settings/container.css')

function SettingsLayout(props) {
  const {memberships, user, scope, auditLogEnabled, router} = props

  return (
    <div className={headerStyles.settingsLayout}>
      <Header {...props} />
      <main id="main">
        <div className={styles.container}>
          <Sidebar
            memberships={memberships}
            user={user}
            scope={scope}
            auditLogEnabled={auditLogEnabled}
            router={router}
          />
          <div className={styles.main}>
            <div className={styles.content}>{props.children}</div>
          </div>
        </div>
      </main>
      <Footer hasMarginTop={false} />
    </div>
  )
}

module.exports = SettingsLayout
