'use strict'

const React = require('react')
const Header = require('../header')
const Footer = require('../footer')

module.exports = function DefaultLayout(props) {
  return (
    <div className="flex flex-column vh-100">
      <Header {...props} />
      <main id="main">{props.children}</main>
      <Footer />
    </div>
  )
}
