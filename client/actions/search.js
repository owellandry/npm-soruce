'use strict'
const Router = require('@npm/spiferack/router')
const formDataToObject = require('../form-data')
const debounce = require('p-debounce')

const delay = 250

const submit = debounce(data => {
  return Router.get().submit({
    action: '/search',
    method: 'GET',
    data,
  })
}, delay)

module.exports = () => (dispatch, getState) => {
  const {formData} = getState().props

  const queryObj = formDataToObject(formData.search)
  const data = new Map()
  Object.keys(queryObj).forEach(key => {
    data.set(key, queryObj[key])
  })

  return submit(data)
}
