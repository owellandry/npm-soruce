'use strict'
const {createCrudRunnersFor} = require('../crud')

module.exports = Object.assign(
  {},
  require('./routing'),
  require('./billing'),
  require('./profile'),
  require('./provenance'),
  require('./orgs'),
  createCrudRunnersFor('ORG_MEMBER'),
  createCrudRunnersFor('ORG_TEAM'),
  createCrudRunnersFor('ORG_INVITE'),
  createCrudRunnersFor('TOKEN'),
  require('./autolink'),
  require('./link'),
  require('./fetch'),
  require('./star'),
  require('./teams'),
)
