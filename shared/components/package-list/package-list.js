'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const UnifiedView = require('./unified-view')
const SortedView = require('./sorted-view')

function PackageList({shouldShowLinkedPackages, ...props}) {
  return shouldShowLinkedPackages ? <SortedView {...props} /> : <UnifiedView packages={props.packages} />
}

PackageList.propTypes = {
  packages: PropTypes.arrayOf(types.packageListItem).isRequired,
  scope: PropTypes.string,
  shouldShowLinkedPackages: PropTypes.bool,
  autoLinkingUrl: PropTypes.string,
  selectedTab: PropTypes.string,
  pkgsCounts: PropTypes.object,
}

module.exports = PackageList
