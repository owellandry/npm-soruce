'use strict'
const {assocIn, getIn} = require('icepick')

module.exports = {
  FORM_VALIDITY_CHECK(prevState, {name, formId, errorMessage: error}) {
    const path = formId
      ? ['props', 'formData', formId, name, 'errorMessage']
      : ['props', 'formData', name, 'errorMessage']
    return updateValidity(assocIn(prevState, path, error), formId)
  },
  FORM_CHANGE(prevState, {name, formId, value}) {
    const path = formId ? ['props', 'formData', formId, name] : ['props', 'formData', name]
    return updateValidity(
      assocIn(prevState, path, {
        value,
        errorMessage: null,
      }),
      formId,
    )
  },
  FORM_RESET(prevState, {formId, formData}) {
    return assocIn(prevState, ['props', 'formData', formId], formData)
  },
  FORM_REMOVE(prevState, {formId}) {
    const currentFormData = prevState.props.formData || {}
    const newFormData = {...currentFormData}
    delete newFormData[formId]
    return assocIn(prevState, ['props', 'formData'], newFormData)
  },
}

function updateValidity(prevState, formId) {
  const path = formId ? ['props', 'formData', formId] : ['props', 'formData']

  const formData = getIn(prevState, path)
  const invalid = Object.keys(formData).some(key => {
    return formData[key].errorMessage
  })
  path.push('__invalid__')
  return assocIn(prevState, path, invalid)
}
