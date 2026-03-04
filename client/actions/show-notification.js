'use strict'
/**
 * Shows notification
 * @param {{ level?: 'error' | 'warning' | 'success', message: string, link?: { href?: string, action?: object, text: string }, duration?: number }} notificationConfig
 * @returns
 */
module.exports = ({level = 'error', message, link, duration}) => {
  return {
    type: 'NOTIFICATION_SHOW',
    level,
    message,
    link,
    duration,
  }
}
