'use strict'

const middleware = [
  require('./document-context'),
  require('./globals'),
  require('@npm/spiferack/shared/middleware/process'),
  require('./metrics'),
  require('./store'),
  require('./verify-email'),
  require('./application'),
  require('./helmet'),
]

module.exports = middleware.map(xs => xs())
