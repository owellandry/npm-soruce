'use strict'

const React = require('react')
const {isInteractiveElement} = require('../../lib/utils/dom.js')

class Scroll extends React.Component {
  constructor(props) {
    super(props)
    this.scrollToHash = this.scrollToHash.bind(this)
  }

  componentDidMount() {
    this.path = global.location.pathname

    // Prevents scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // Workaround
    window.scrollTo(0, 0)

    this.scrollToHash()
    global.addEventListener('hashchange', this.scrollToHash)
  }

  componentDidUpdate() {
    // Handles hash in case of path change
    const newPath = global.location.pathname
    if (this.path !== newPath) this.scrollToHash()
    this.path = newPath
  }

  componentWillUnmount() {
    global.removeEventListener('hashchange', this.scrollToHash)
  }

  scrollToHash() {
    const id = this.getHashId
    if (!id) return

    const anchor = global.document.getElementById(id)
    if (anchor) {
      // Run after DOM updates and Link scrollTo(0,0)
      setTimeout(() => {
        anchor.scrollIntoView()
        // Update focus to where the page is scrolled to so tabbing works as expected
        const nonInteractiveEl = !isInteractiveElement(anchor)
        if (nonInteractiveEl) {
          anchor.setAttribute('tabindex', '-1')
        }
        anchor.focus({preventScroll: true})
        if (nonInteractiveEl) {
          anchor.removeAttribute('tabindex')
        }
      }, 0)
    }
  }

  get getHashId() {
    const hashVal = global.location.hash.replace('#', '')
    const hash = decodeURIComponent(hashVal).toLowerCase()
    const currentPath = global.location.pathname
    const IS_PACKAGE_PAGE = /package/.test(currentPath)
    return IS_PACKAGE_PAGE ? `user-content-${hash}` : hash
  }

  render() {
    return null
  }
}

module.exports = Scroll
