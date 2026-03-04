'use strict'

const formDataToObject = require('../form-data')
const fetch = require('./fetch')
const debounce = require('p-debounce')

const delay = 250

const xhrSearch = debounce((dispatch, queryObj) => {
  return dispatch(
    fetch(`/search/suggestions?q=${queryObj.q}`, {
      method: 'GET',
    }),
  )
}, delay)

module.exports = () => (dispatch, getState) => {
  const {formData} = getState().props

  const queryObj = formDataToObject(formData.search)

  const result = xhrSearch(dispatch, queryObj)
  if (!result) return Promise.resolve([])
  return result
}
