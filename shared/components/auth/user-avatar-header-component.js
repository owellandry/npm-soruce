'use strict'

const React = require('react')
const Avatar = require('@npm/design-system/avatar/avatar')

const styles = require('../../pages/auth/auth.css')
const forms = require('../../styles/forms.css')

function SwitchAccountLink({href, enabled}) {
  return enabled ? (
    <span>
      <a href={href} className={`${forms.link} ${styles.switchAccount}`}>
        Use a different account
      </a>
      .
    </span>
  ) : null
}

function AuthenticatingUser({user, trailingPeriod}) {
  if (!user) {
    return null
  }
  const avatar =
    user && user.avatars ? <Avatar src={user.avatars.small} size="inline" title={user.name} aria-hidden /> : null
  return (
    <div className="dib">
      Authenticating as {avatar}
      <span className="fw6"> {user.name}</span>
      {trailingPeriod && '.'}
    </div>
  )
}

class UserAvatarHeaderComponent extends React.PureComponent {
  render() {
    const {isNewCliLoginFlowEscalation, isNewPublishAuthEscalation, switchAccountUrl, tokenUser: user} = this.props
    return (
      <div>
        <h1 className={styles.pageHeader}>Two-Factor Authentication</h1>
        <h2 className={`${styles.pageSubHeader} ${styles.subHeaderText}`}>
          <AuthenticatingUser user={user} trailingPeriod={isNewCliLoginFlowEscalation} />
          {!isNewPublishAuthEscalation ? (
            <SwitchAccountLink href={switchAccountUrl} enabled={isNewCliLoginFlowEscalation} />
          ) : null}
        </h2>
      </div>
    )
  }
}

UserAvatarHeaderComponent.layout = 'none'

module.exports = UserAvatarHeaderComponent
