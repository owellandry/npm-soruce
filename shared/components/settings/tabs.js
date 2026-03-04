'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const Tabs = require('../tabs/tabs.js')

const BoxIcon = require('../icons/box')
const GroupIcon = require('../icons/group')
const CreditCardIcon = require('../icons/credit-card')
const UserIcon = require('../icons/user')

function SettingsTabs(props) {
  const {scope, canEditScope, active} = props
  const scopeURI = encodeURIComponent(scope.parent.name)
  const links = [
    {
      href: `/settings/${scopeURI}/packages`,
      label: (
        <span>
          <BoxIcon />
          Packages
        </span>
      ),
      key: 'packages',
    },
    scope.type === 'org'
      ? {
          href: `/settings/${scopeURI}/members`,
          label: (
            <span>
              <UserIcon />
              Members
            </span>
          ),
          key: 'members',
        }
      : null,
    scope.type === 'org'
      ? {
          href: `/settings/${scopeURI}/teams`,
          label: (
            <span>
              <GroupIcon />
              Teams
            </span>
          ),
          key: 'teams',
        }
      : null,
    canEditScope
      ? {
          href: `/settings/${scopeURI}/billing`,
          label: (
            <span>
              <CreditCardIcon />
              Billing
            </span>
          ),
          key: 'billing',
        }
      : null,
  ].filter(Boolean)

  return <Tabs links={links} active={active} />
}

SettingsTabs.propTypes = {
  scope: PropTypes.object.isRequired,
  canEditScope: PropTypes.bool.isRequired,
}

module.exports = SettingsTabs
