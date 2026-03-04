'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const connect = require('../connect')
const CopyIcon = require('../icons/copy')
const styles = require('./ezcopy.css')

class EZCopy extends React.PureComponent {
  render() {
    return (
      <span className={styles.container}>
        <code>{this.props.children}</code>
        <button
          className={styles.copyButton}
          type="button"
          onClick={ev => this.copy(ev)}
          onMouseEnter={ev => this.select(ev)}
          onMouseLeave={() => this.deselect()}
          onBlur={() => this.deselect()}
          aria-label={this.props['aria-label'] || ''}
        >
          <CopyIcon />
        </button>
      </span>
    )
  }

  select(ev) {
    const range = global.document.createRange()
    range.selectNode(ev.target.previousElementSibling)
    global.getSelection()?.removeAllRanges()
    global.getSelection()?.addRange(range)
  }

  deselect() {
    global.getSelection()?.removeAllRanges()
  }

  copy(ev) {
    this.select(ev)
    const success = global.document.execCommand('copy')
    if (success) {
      this.props.dispatch({
        type: 'NOTIFICATION_SHOW',
        message: '✔ Copied to clipboard!',
        level: 'success',
        duration: 2000,
      })
    }
  }
}

EZCopy.propTypes = {
  children: PropTypes.node.isRequired,
}

module.exports = connect()(EZCopy)
