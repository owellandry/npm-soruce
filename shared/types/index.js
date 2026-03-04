'use strict'
const PropTypes = require('prop-types')

exports.formDatum = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
  errorMessage: PropTypes.string,
})

const singleFormData = (props, propName, componentName) => {
  const obj = Object.assign({}, props[propName])
  const invalid = obj != null ? obj.__invalid__ : null
  delete obj.__invalid__
  const err = PropTypes.checkPropTypes(
    {formData: PropTypes.objectOf(exports.formDatum)},
    {formData: obj},
    'formData',
    componentName,
  )
  if (err) return err
  if (invalid != null && typeof invalid !== 'boolean') {
    return new Error(`Invalid prop '${propName}' supplied to ${componentName}.`)
  }
}

exports.formData = PropTypes.objectOf(singleFormData)

exports.date = PropTypes.shape({
  ts: PropTypes.number,
  rel: PropTypes.string,
})

exports.packageListItem = PropTypes.shape({
  author: PropTypes.shape({}),
  date: exports.date,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  links: PropTypes.shape({
    npm: PropTypes.string,
    homepage: PropTypes.string,
    repository: PropTypes.string,
    bugs: PropTypes.string,
    pending: PropTypes.bool,
    linkingServiceCode: PropTypes.string,
  }),
  maintainers: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
      }),
      PropTypes.string,
    ]),
  ),
  name: PropTypes.string.isRequired,
  publisher: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatars: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  version: PropTypes.string.isRequired,
})
