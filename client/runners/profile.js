'use strict'
const showNotification = require('../actions/show-notification')
const fetch = require('../actions/fetch')

module.exports = {
  FETCH_PACKAGES: (dispatch, {url}) => {
    return window
      .fetch(url, {headers: {'x-spiferack': '1'}, credentials: 'include'})
      .then(response => {
        return response.json()
      })
      .then(body => {
        dispatch('SHOW_PACKAGES_LOADED')
        dispatch({
          type: 'UPDATE_PACKAGES',
          packages: body.packages,
        })
      })
      .catch(e => {
        console.warn('Error loading packages: ', e)
        dispatch('SHOW_PACKAGES_LOADED')
        dispatch(
          showNotification({
            level: 'error',
            message: 'There was a problem loading more packages. Please try again.',
            duration: 15000,
          }),
        )
      })
  },
  RESEND_VERIFICATION_EMAIL: dispatch => {
    return dispatch(fetch('/verify/resend-email', {method: 'POST'})).then(() =>
      dispatch(
        showNotification({
          level: 'success',
          message: 'Email sent.',
        }),
      ),
    )
  },
}
