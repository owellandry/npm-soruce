'use strict'

module.exports = pluralize

/**
 * Use like this:
 *
 * pluralize(2)`package${['s']}`
 * // packages
 *
 * pluralize(1)`package${['s']}`
 * // package
 *
 * pluralize(2)`agenc${['ies', 'y']}`
 * // agencies
 *
 * pluralize(1)`agenc${['ies', 'y']}`
 * // agency
 *
 * pluralize(2)`package${['s']} agenc${['ies', 'y']}`
 * // packages agencies
 */

function pluralize(total) {
  return function (strings, ...tokens) {
    return strings.reduce((acc, item, index) => {
      const token = tokens[index - 1]
      let chunk = ''
      if (Array.isArray(token)) {
        if (total !== 1) {
          chunk = token[0]
        }
        if (total === 1 && token.length === 2) {
          chunk = token[1]
        }
      } else {
        chunk = token
      }
      return acc + chunk + item
    })
  }
}
