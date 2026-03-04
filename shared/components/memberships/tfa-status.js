'use strict'
const React = require('react')
const styles = require('./tfa-status.css')

function TFAStatus({tfa}) {
  if (tfa === null) return null

  const has2FA = tfa && tfa.tfa_enabled

  return (
    <div className={`${styles.status} ${has2FA ? styles.enabled : styles.disabled}`}>
      <span className="pr2">{has2FA && '🔒'}</span>
      {has2FA ? `2FA for ${tfa.mode === 'auth-only' ? 'Auth' : 'Auth/Writes'}` : '2FA Disabled'}
    </div>
  )
}

TFAStatus.defaultProps = {
  tfa: null,
}

module.exports = TFAStatus
