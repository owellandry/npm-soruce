'use strict'

const React = require('react')
const {MarkGithubIcon} = require('@primer/octicons-react')

class GitHubIcon extends React.PureComponent {
  render() {
    const size = this.props.size || 16
    const className = this.props.className || ''
    const verticalAlign = this.props.verticalAlign || 'top'
    // The Octocat icon uses the current text color and respects high contrast mode
    return <MarkGithubIcon fill="currentColor" size={size} className={className} verticalAlign={verticalAlign} />
  }
}

module.exports = GitHubIcon
