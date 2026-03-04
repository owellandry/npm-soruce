'use strict'

const PropTypes = require('prop-types')
const React = require('react')
const SettingsSubhead = require('./subhead')
const SettingsTabs = require('./tabs')

class SettingsContainer extends React.PureComponent {
  render() {
    const {scope, canEditScope, activeTab} = this.props
    const isUserPage = scope.type === 'user'
    const tabPanelAttributes = {
      role: 'tabpanel',
      id: `tabpanel-${activeTab}`,
      'aria-expanded': true,
    }
    return (
      <div>
        {!isUserPage && (
          <div>
            <SettingsSubhead scope={scope} />
            <SettingsTabs scope={scope} canEditScope={canEditScope} active={activeTab} />
            <br />
          </div>
        )}
        <div {...(!isUserPage ? tabPanelAttributes : {})}>{this.props.children}</div>
      </div>
    )
  }
}

SettingsContainer.propTypes = {
  scope: PropTypes.object.isRequired,
  canEditScope: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
}

SettingsContainer.defaultProps = {
  canEditScope: false,
}

module.exports = SettingsContainer
