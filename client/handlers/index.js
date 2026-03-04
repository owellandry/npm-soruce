'use strict'

const {createCrudHandlersFor} = require('../crud')
const {freeze, updateIn, assocIn, pop} = require('icepick')

module.exports = Object.assign(
  {
    INIT(prevState, {rendererName, props}) {
      return freeze({rendererName, props, componentError: null})
    },
    USER_DROPDOWN_TOGGLE(prevState) {
      return updateIn(prevState, ['props', 'userDropdownOpen'], (state = false) => !state)
    },
    USER_DROPDOWN_CLOSE(prevState) {
      return assocIn(prevState, ['props', 'userDropdownOpen'], false)
    },
    COMPONENT_ERROR(prevState, {error}) {
      return assocIn(prevState, ['props', 'componentError'], error.stack || error.message)
    },
    PACKAGE_TAB(prevState, {activeTab}) {
      return assocIn(prevState, ['props', 'activeTab'], activeTab)
    },
    TAB_CLICKED(prevState, {tabClicked}) {
      return assocIn(prevState, ['props', 'tabClicked'], tabClicked)
    },
  },
  require('./link'),
  require('./notifications'),
  require('./routing'),
  require('./forms'),
  require('./profile'),
  require('./provenance'),
  require('./alert-banners'),
  createCrudHandlersFor({
    prefix: 'ORG_MEMBER',
    identify(lhs, rhs) {
      return lhs.user.name === rhs.user.name
    },
  }),
  createCrudHandlersFor({
    prefix: 'ORG_TEAM',
    identify(lhs, rhs) {
      return lhs.name === rhs.name
    },
  }),
  createCrudHandlersFor({
    prefix: 'TEAM_MEMBER',
    identify(lhs, rhs) {
      return lhs.user.name === rhs.user.name
    },
  }),
  createCrudHandlersFor({
    prefix: 'TEAM_PACKAGE',
    identify(lhs, rhs) {
      return lhs.package.name === rhs.package.name
    },
  }),
  createCrudHandlersFor({
    prefix: 'TOKEN',
    identify(lhs, rhs) {
      return lhs.hash === rhs.tokens
    },
  }),
  createCrudHandlersFor({
    prefix: 'ORG_INVITE',
    identify(lhs, rhs) {
      const lhId = (lhs.user && lhs.user.name) || lhs.email
      const rhId = (rhs.user && rhs.user.name) || rhs.email
      return lhId === rhId
    },
  }),
)
