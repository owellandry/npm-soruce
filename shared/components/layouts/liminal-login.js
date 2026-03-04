'use strict'

const React = require('react')
const styles = require('./liminal.css')
const Logo = require('../header/logo')

class LiminalLoginLayout extends React.PureComponent {
  render() {
    let {Footer, Header} = this.props

    if (typeof Header === 'string') {
      Header = <h1 className={styles.textHeader}>{Header}</h1>
    }

    return (
      <div className={styles.container}>
        <main id="main">
          <header>
            <Logo />
          </header>
          {Header}
          <div className={styles.main}>
            <section className={styles.content}>{this.props.children}</section>
            {Footer}
          </div>
        </main>
      </div>
    )
  }
}

module.exports = LiminalLoginLayout
