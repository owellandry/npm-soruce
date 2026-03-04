const React = require('react')
const PaneHomepageContent = require('./pane-homepage-content')

module.exports = class Homepage extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <PaneHomepageContent />
      </div>
    )
  }
}
