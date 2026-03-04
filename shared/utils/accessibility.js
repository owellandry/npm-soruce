module.exports = {
  activateArrowKeyNavigation,
}
function activateArrowKeyNavigation(container, targetSelector, options = {}) {
  options = {
    vertical: true,
    horizontal: false,
    ...options,
  }

  if (!(container && targetSelector)) {
    return {deactivate: () => {}}
  }

  const targets = [...container.querySelectorAll(targetSelector)]
  const navigationHandler = event => {
    let index = targets.indexOf(event.target)
    switch (event.key) {
      case 'ArrowUp':
        if (options.vertical) index--
        break
      case 'ArrowDown':
        if (options.vertical) index++
        break
      case 'ArrowLeft':
        if (options.horizontal) index--
        break
      case 'ArrowRight':
        if (options.horizontal) index++
        break
      default:
        return
    }
    if (index >= 0 && index < targets.length) {
      event.preventDefault()
      targets[index].focus()
    }
  }

  targets.forEach(target => target.addEventListener('keydown', navigationHandler))
  return {
    deactivate: () => targets.forEach(target => target.removeEventListener('keydown', navigationHandler)),
  }
}
