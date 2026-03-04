'use strict'
const {updateIn, assocIn, push, filter, freeze, thaw} = require('icepick')

let id = 42
const nextId = () => {
  return id++
}

module.exports = {
  NOTIFICATION_SHOW: (prevState, notification) => {
    const {message, level, duration, link} = notification

    return updateIn(prevState, ['props', 'notifications'], (notes = []) => {
      return push(notes, {
        id: nextId(),
        level,
        message,
        link: link ? thaw(freeze(link)) : null, // thaw(freeze()) ~= cloneDeep()
        duration,
      })
    })
  },
  NOTIFICATION_CLOSE: (prevState, {id}) => {
    return updateIn(prevState, ['props', 'notifications'], (notes = []) => {
      return filter(note => note.id !== id, notes)
    })
  },
  NOTIFICATION_CLOSE_ALL: (prevState, {id}) => {
    return assocIn(prevState, ['props', 'notifications'], [])
  },
}
