'use strict'

const {freeze, assocIn} = require('icepick')

module.exports = {
  ROUTE(prevState, {rendererName, props}) {
    return freeze({rendererName, props})
  },
  ROUTE_START(prevState) {
    return assocIn(assocIn(prevState, ['props', 'loading'], true), ['props', 'componentError'], null)
  },
  ROUTE_COMPLETE(prevState) {
    return assocIn(prevState, ['props', 'loading'], false)
  },
}
