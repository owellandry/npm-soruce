'use strict'

const Router = require('@npm/spiferack/router')

module.exports = {
  GO(dispatch, {url}) {
    return Router.get().go(url)
  },
}
