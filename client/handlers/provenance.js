const {assocIn} = require('icepick')

module.exports = {
  UPDATE_PROVENANCE_DETAILS: (prevState, {details}) => {
    return assocIn(prevState, ['props', 'provenance', 'details'], details)
  },

  SHOW_PROVENANCE_LOADING: prevState => {
    return assocIn(
      assocIn(prevState, ['props', 'provenance', 'loading'], true),
      ['props', 'provenance', 'error'],
      false,
    )
  },

  SHOW_PROVENANCE_LOADED: (prevState, options = {}) => {
    const error = options.error ? options.error : false
    return assocIn(
      assocIn(prevState, ['props', 'provenance', 'loading'], false),
      ['props', 'provenance', 'error'],
      error,
    )
  },
}
