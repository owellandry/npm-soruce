'use strict'

const React = require('react')
const styles = require('./liminal-wide.css')
const Logo = require('../header/logo')

// A page that is a single form for a one-time task.  Minimal site
// branding to avoid distraction.
class LiminalWideLayout extends React.PureComponent {
  render() {
    const {Footer} = this.props

    return (
      <div className={styles.container}>
        <main id="main">
          <header>
            <Logo />
          </header>
          <div className={styles.main}>
            <section className={styles.content}>{this.props.children}</section>
            {Footer}
          </div>
        </main>
      </div>
    )
  }
}

module.exports = LiminalWideLayout
