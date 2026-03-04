'use strict'

const {unsetIn, setIn, chain} = require('icepick')

module.exports = {
  PACKAGE_AUTO_LINK_ERROR: prevState => unsetIn(prevState, ['props', 'autoLinkingPending']),

  SET_PACKAGE_LINK_STATUS: (state, {name, status}) => setIn(state, ['props', 'linkingStatus', name], status),

  SET_PACKAGE_LINKED_REPO: (state, {name, repository}) => {
    const next = chain(state).unsetIn(['props', 'linkingStatus', name])
    // single package page
    if (state.rendererName === 'package/package') {
      return next.unsetIn(['props', 'linkingAllowedForPackage']).setIn(['props', 'repository'], repository).value()
    }

    // packages list page
    const index = state.props.packages.objects.findIndex(p => p.name === name)
    if (index < 0) {
      return next.value()
    }

    return next
      .setIn(['props', 'packages', 'objects', index, 'repository'], repository)
      .updateIn(['props', 'packagesCounts'], packagesCounts => ({
        ...packagesCounts,
        unlinked: packagesCounts.unlinked - 1,
        linked: packagesCounts.linked + 1,
      }))
      .value()
  },
}
