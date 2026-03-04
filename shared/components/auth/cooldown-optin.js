'use strict'

const React = require('react')

const styles = require('../../pages/auth/auth.css')
const Checkbox = require('../inputs/checkbox')

class CooldownOptin extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleCooldownOptinChange = this.handleCooldownOptinChange.bind(this)
  }

  handleCooldownOptinChange = event => {
    this.props.onCooldownOptinChange(event.target.checked)
  }

  render() {
    if (!this.props.cooldownMetadata || !this.props.cooldownMetadata.isCooldownAllowed) {
      return null
    }
    const {formData = {}} = this.props
    const {userIp, cooldownAllowedCommands, cooldownTtlMinutes} = this.props.cooldownMetadata

    const cooldownLabel = `Do not challenge ${cooldownAllowedCommands} operations from IP address ${userIp} for the next ${cooldownTtlMinutes} minutes`
    const cooldownOptin = (
      <div className={styles.cooldown}>
        <Checkbox
          name="didOptForCooldown"
          formId="cooldownOptin"
          onChange={this.handleCooldownOptinChange}
          label={''}
          ariaLabel={cooldownLabel}
          formData={formData}
        />
        <p className={styles.cooldownText} aria-hidden>
          Do not challenge <span className={styles.cooldownCommands}>{cooldownAllowedCommands}</span> operations from IP
          address {userIp} for the next {cooldownTtlMinutes} minutes
        </p>
      </div>
    )
    return cooldownOptin
  }
}

module.exports = CooldownOptin
