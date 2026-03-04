'use strict'
const fetch = require('../actions/fetch')

module.exports = {
  STAR_PKG: (dispatch, {pkg}) => {
    return dispatch(
      fetch(`/package/${pkg}/star`, {
        method: 'POST',
        body: {
          star: true,
        },
      }),
    )
  },
  UNSTAR_PKG: (dispatch, {pkg, csrftoken}) => {
    return dispatch(
      fetch(`/package/${pkg}/star`, {
        method: 'POST',
        body: {
          star: false,
        },
      }),
    )
  },
}
