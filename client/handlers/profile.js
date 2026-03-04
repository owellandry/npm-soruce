const {assocIn, updateIn, merge} = require('icepick')

module.exports = {
  UPDATE_PACKAGES: (prevState, {packages: nextPackages}) => {
    let result = updateIn(prevState, ['props', 'packages'], packages => {
      return merge(packages, nextPackages, (targetVal, sourceVal) => {
        if (Array.isArray(targetVal) && sourceVal) {
          return targetVal.concat(sourceVal)
        } else {
          return sourceVal
        }
      })
    })
    result = assocIn(result, ['props', 'packages', 'urls'], nextPackages.urls)
    return result
  },

  SHOW_PACKAGES_LOADING: prevState => {
    return assocIn(prevState, ['props', 'profilePackagesLoading'], true)
  },

  SHOW_PACKAGES_LOADED: prevState => {
    return assocIn(prevState, ['props', 'profilePackagesLoading'], false)
  },
}
