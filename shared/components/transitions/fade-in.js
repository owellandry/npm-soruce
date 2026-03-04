'use strict'

const React = require('react')
const styles = require('./transitions.css')
const {TransitionGroup, CSSTransition} = require('react-transition-group')

module.exports = function FadeIn({children}) {
  let child
  if (children) {
    child = React.Children.only(children)
    if (!child.key) {
      child = React.cloneElement(child, {key: 'item'})
    }
  }
  return (
    <TransitionGroup>
      <CSSTransition
        classNames={{
          appear: styles.fadeIn,
          appearActive: styles.fadeInActive,
          enter: styles.fadeIn,
          enterActive: styles.fadeInActive,
          exit: styles.fadeOut,
          exitActive: styles.fadeOutActive,
        }}
        timeout={{
          enter: 200,
          exit: 200,
        }}
      >
        {child || <div key="empty" />}
      </CSSTransition>
    </TransitionGroup>
  )
}
