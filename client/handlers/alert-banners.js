'use strict'
const {updateIn, assocIn, push, filter, freeze, thaw} = require('icepick')

let id = 2000 // Start with higher ID to avoid conflicts with banners and notifications
const nextId = () => {
  return id++
}

module.exports = {
  ALERT_BANNER_SHOW: (prevState, alertBanner) => {
    const {message, level, duration, link} = alertBanner

    return updateIn(prevState, ['props', 'alertBanners'], (alertBanners = []) => {
      return push(alertBanners, {
        id: nextId(),
        level,
        message,
        link: link ? thaw(freeze(link)) : null, // thaw(freeze()) ~= cloneDeep()
        duration,
      })
    })
  },
  ALERT_BANNER_CLOSE: (prevState, {id}) => {
    return updateIn(prevState, ['props', 'alertBanners'], (alertBanners = []) => {
      return filter(alertBanner => alertBanner.id !== id, alertBanners)
    })
  },
  ALERT_BANNER_CLOSE_ALL: prevState => {
    return assocIn(prevState, ['props', 'alertBanners'], [])
  },
}
