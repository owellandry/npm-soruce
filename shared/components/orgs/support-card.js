'use strict'
const React = require('react')
const styles = require('../../styles/global.css')
const Link = require('@npm/spiferack/link')

module.exports = function SupportCard() {
  return (
    <p className="mt4 tc black-90">
      Need help?{' '}
      <Link>
        <a className={styles.linkUnderline} href="/support">
          Contact support
        </a>
      </Link>{' '}
      or check out the{' '}
      <Link>
        <a className={styles.linkUnderline} href="https://docs.npmjs.com/orgs/">
          organization documentation
        </a>
      </Link>
      .
    </p>
  )
}
