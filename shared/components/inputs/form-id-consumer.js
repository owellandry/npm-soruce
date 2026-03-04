'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const {getIn} = require('icepick')
const shallowCompare = require('shallow-compare').default || require('shallow-compare')

// higher-order component that slurps a formId from context, and manages updates
// to the wrapped input component
module.exports = function decorateInput(Input) {
  class FormIdConsumer extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.formId = props.formId || context.formId
    }

    shouldComponentUpdate(nextProps, nextState) {
      const propUpdate = shallowCompare(this, nextProps, nextState)

      if (!propUpdate) return false // absolutely nothing changed

      const curFormData = this.props.formData
      const nextFormData = nextProps.formData

      if (curFormData === nextFormData) return true // a non-formData prop changed

      // check the sub-prop of formData
      const path = this.getFormDataPath()

      if (getIn(curFormData, path) !== getIn(nextFormData, path)) {
        return true // our form data changed
      }

      // check props but not formData
      for (const key of Object.keys(nextProps)) {
        if (key === 'formData') {
          continue
        }

        if (this.props[key] !== nextProps.key) {
          return true
        }
      }

      return false // nothing in form data related to this component changed
    }

    getFormDataPath() {
      const formId = this.formId
      // TODO: do we need to handle the no-formId case?
      return formId ? [formId, this.props.name] : [this.props.name]
    }

    render() {
      const props = Object.assign({}, this.props, {
        formId: this.formId,
        formData: getIn(this.props.formData, this.getFormDataPath()) || {},
      })
      return <Input {...props} />
    }
  }

  FormIdConsumer.displayName = `FormIdConsumer(${Input.name})`

  FormIdConsumer.contextTypes = {
    formId: PropTypes.string,
  }

  FormIdConsumer.propTypes = {
    formId: PropTypes.string,
    name: PropTypes.string.isRequired,
    formData: PropTypes.oneOfType([
      // TODO: do we need to handle the no-formId case?
      types.formData,
      types.formData,
    ]).isRequired,
  }

  FormIdConsumer.unwrapped = Input

  return FormIdConsumer
}
