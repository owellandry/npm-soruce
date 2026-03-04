'use strict'
const {Helmet} = require('react-helmet')

module.exports = () => ({
  async processInitial(props, session, next) {
    const component = await next()
    const helmet = Helmet.renderStatic()
    session.head(`
      ${helmet.title}
      ${helmet.meta}
      ${helmet.link}
      ${helmet.style}
      ${helmet.script}
    `)
    return component
  },
})
