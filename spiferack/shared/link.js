'use strict'

// all credit goes to next.js!
const React = require('react')

const Router = require('./router')
const parsePath = require('./parse-path')

module.exports = class Link extends React.Component {
  render() {
    const {children = [], href, target, replace = false} = this.props
    const [child, ...rest] = Array.isArray(children) ? children : [children]
    this.childProps = child.props
    this.href = href || child.props.href
    this.target = target || child.props.target
    this.replace = replace

    if (rest.length) {
      throw new Error('Expected one child')
    }
    const props = {
      onClick: (...args) => this.onclick(...args),
    }
    if (child.type === 'a' && !('href' in child.props)) {
      props.href = this.href
    }
    return React.cloneElement(child, props)
  }

  onclick(ev) {
    if (
      ev.currentTarget.nodeName === 'A' &&
      (ev.metaKey || ev.ctrlKey || ev.shiftKey || (ev.nativeEvent && ev.nativeEvent.which === 2))
    ) {
      return
    }

    const baseTarget = getBaseTarget()
    if (baseTarget === '_blank') {
      return
    }

    const path = parsePath(this.href)
    if (this.target || !isLocal(path) || !this.href) {
      return
    }

    const {pathname, search, hash} = path
    ev.preventDefault()
    Router.get()
      .go(
        {
          pathname,
          search,
          hash,
          replaceState: this.replace,
        },
        {
          linkProps: this.childProps,
          replaceState: this.replace,
        },
      )
      .then(scroll => {
        if (scroll) {
          window.scrollTo(0, 0)
        }
      })
  }
}

function getBaseTarget() {
  const head = document.head
  const baseNode = head.getElementsByTagName('base')[0]
  return baseNode && baseNode.target
}

function getOrigin(from) {
  const {protocol, hostname, port} = from
  return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

function isLocal(anchor) {
  return getOrigin(window.location) === getOrigin(anchor)
}
