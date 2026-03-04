const fetch = require('../actions/fetch')
const showNotification = require('../actions/show-notification')

module.exports = {
  LINK_PACKAGE: async (dispatch, {scope, name}) => {
    dispatch({type: 'SET_PACKAGE_LINK_STATUS', name, status: {pending: true}})

    try {
      const url = `/settings/${scope}/packages/${encodeURIComponent(name)}/link`
      const status = await dispatch(fetch(url, {method: 'POST'}))

      if (status.message) {
        dispatch(showNotification({message: status.message}))
      } else if (status.repository) {
        dispatch({type: 'SET_PACKAGE_LINKED_REPO', name, repository: status.repository})
      } else {
        dispatch({type: 'SET_PACKAGE_LINK_STATUS', name, status})
      }
    } catch (err) {
      dispatch({type: 'SET_PACKAGE_LINK_STATUS', name, status: undefined})
      dispatch(showNotification({message: 'Linking package failed', duration: 5000}))
    }
  },

  DELETE_PENDING_PACKAGE_LINK: (dispatch, {scope, name}) => {
    const url = `/settings/${scope}/packages/${encodeURIComponent(name)}/pending`

    return dispatch(fetch(url, {method: 'DELETE'}))
  },
}
