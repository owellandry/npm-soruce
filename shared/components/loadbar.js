'use strict'
const React = require('react')
const styles = require('../styles/global.css')

class LoadBar extends React.PureComponent {
  constructor(...props) {
    super(...props)
    this.state = {
      width: 1,
      visible: false,
      growing: false,
    }
  }

  componentWillReceiveProps({loading, progress = 1}) {
    const wasLoading = this.props.loading
    // set the state based on the loading bit flipping
    if (!wasLoading && loading) {
      this.setState({
        visible: true,
        growing: true,
        width: 0,
      })

      // delay so navigations that are < 100ms show no bar
      this.delay(() => this.setState({width: progress}), 100)
    } else if (wasLoading && !loading) {
      this.setState({growing: false, width: 1})
      this.delay(() => this.setState({visible: false}), 0)
    }
  }

  delay(fn, delay) {
    clearTimeout(this.timer)
    this.timer = setTimeout(fn, delay)
  }

  render() {
    const {width, visible, growing} = this.state
    const transform = `scaleX(${width})`
    return (
      <div
        /*
         * swap the key to force a different element,
         * clearing the transition.  This causes it to snap to 100%
         * width when we're no longer loading
         */
        key={growing ? 'growing' : 'static'}
        className={styles.loadBar}
        style={{
          opacity: visible ? 1 : 0,
          transform,
          WebkitTransform: transform,
          MozTransform: transform,
        }}
      />
    )
  }
}

module.exports = LoadBar
