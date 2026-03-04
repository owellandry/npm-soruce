const React = require('react')
const {ThemeProvider} = require('@primer/react')
const customThemeMerged = require('./merged-with-github-style')

const withThemeProvider = Component => props => (
  <ThemeProvider theme={customThemeMerged}>
    <Component {...props} />
  </ThemeProvider>
)

module.exports = withThemeProvider
