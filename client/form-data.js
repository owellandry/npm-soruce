'use strict'

/**
 * Converts a { [key]: {value} } object to { [key]: value }
 * To prepare formData for XHR POSTs
 */
module.exports = function formData(obj) {
  const data = {}

  Object.keys(obj).forEach(key => {
    if (key === '__invalid__') return
    const {value} = obj[key]
    if (value != null) data[key] = value
  })

  return data
}
