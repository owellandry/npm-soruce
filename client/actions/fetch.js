'use strict'
module.exports = (url, options) => (dispatch, getState) => {
  return dispatch(
    Object.assign({}, options, {
      type: 'FETCH',
      url,
      csrftoken: getState().props.csrftoken,
    }),
  )
}
