'use strict'

// Check if a DOM element is an interactive element or not
// See spec for more details: https://html.spec.whatwg.org/dev/dom.html#interactive-content
function isInteractiveElement(element) {
  const {nodeName} = element

  if (['BUTTON', 'DETAILS', 'EMBED', 'IFRAME', 'KEYGEN', 'LABEL', 'SELECT', 'TEXTAREA'].includes(nodeName)) {
    return true
  }

  if (nodeName === 'A' && element.hasAttribute('href')) {
    return true
  }

  if (element instanceof global.HTMLInputElement && element.type !== 'hidden') {
    return true
  }

  if (['AUDIO', 'VIDEO'].includes(nodeName) && element.hasAttribute('controls')) {
    return true
  }

  if (['IMG', 'OBJECT'].includes(nodeName) && element.hasAttribute('usemap')) {
    return true
  }

  if (element.hasAttribute('tabindex') && element.tabIndex > -1) {
    return true
  }

  return false
}

// Dispatch cross-browser hashchange event
function dispatchHashChangeEvent() {
  if (typeof global.HashChangeEvent !== 'undefined') {
    window.dispatchEvent(new global.HashChangeEvent('hashchange'))
    return
  }

  // HashChangeEvent is not available on all browsers. Use the plain Event.
  try {
    window.dispatchEvent(new global.Event('hashchange'))
    return
  } catch (_) {
    // Ignore error on IE
  }

  // IE workaround
  const ieEvent = document.createEvent('Event')
  ieEvent.initEvent('hashchange', true, true)
  window.dispatchEvent(ieEvent)
}

module.exports = {
  isInteractiveElement,
  dispatchHashChangeEvent,
}
