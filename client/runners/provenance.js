'use strict'
const showNotification = require('../actions/show-notification')
const fetch = require('../actions/fetch')

module.exports = {
  FETCH_PROVENANCE_DETAILS: async (dispatch, {name, version}) => {
    try {
      dispatch('SHOW_PROVENANCE_LOADING')
      const url = `/package/${name}/v/${version}/provenance`
      const details = await dispatch(fetch(url, {method: 'GET'}))
      if (details.sourceCommitNotFound) {
        dispatch(
          showNotification({
            level: 'error',
            message: `Unable to find the source commit for ${name}@${version}. Please verify the source before using this package.`,
          }),
        )
      }

      dispatch({
        type: 'UPDATE_PROVENANCE_DETAILS',
        details,
      })
      dispatch({
        type: 'SHOW_PROVENANCE_LOADED',
      })
    } catch (err) {
      dispatch({
        type: 'SHOW_PROVENANCE_LOADED',
        error: {name, version},
      })
      dispatch(
        showNotification({
          level: 'error',
          message: `Failed to fetch provenance details for ${name}@${version}. Please try reloading the page.`,
          duration: 15000,
        }),
      )
    }
  },
}
