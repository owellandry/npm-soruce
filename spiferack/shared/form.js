'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const parsePath = require('./parse-path')
const Router = require('./router')

class Form extends React.PureComponent {
  onSubmit(ev) {
    const {onSubmit} = this.props
    if (onSubmit) return onSubmit(ev)

    Form.submit(ev)
  }

  render() {
    const {children} = this.props

    return React.createElement('form', Object.assign({}, this.props, {onSubmit: ev => this.onSubmit(ev)}), children)
  }

  static submit(ev) {
    const FormData = require('formdata-polyfill')
    const formElem = ev.target
    const action = formElem.getAttribute('action')
    const method = formElem.getAttribute('method')
    const formData = new FormData(formElem)

    // Remove values of submit buttons which
    // have not been selected, replicating
    // native form submit behaviour
    for (const key in formElem) {
      if (formElem[key] && formElem[key].__selected) {
        formData.set(formElem[key].name, formElem[key].value)
      }
    }

    Router.get().submit({
      action: parsePath(action),
      method,
      data: formData,
    })
    ev.preventDefault()
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  method: PropTypes.string,
  children: PropTypes.node,
}

module.exports = Form
