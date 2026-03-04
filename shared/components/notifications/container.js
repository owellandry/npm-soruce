'use strict'
const React = require('react')
const propTypes = require('prop-types')
const styles = require('./notifications.css')
const Notification = require('./notification')

function NotificationContainer({notifications}) {
  const [loaded, setLoaded] = React.useState(false)
  const [notificationList, setNotificationList] = React.useState([])
  let interval

  React.useEffect(() => {
    interval = setInterval(stateChangeEvent, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  React.useEffect(() => {
    if (loaded) {
      updateNotifications()
    }
  }, [loaded, notifications])

  const stateChangeEvent = () => {
    if (document.readyState === 'complete') {
      setTimeout(() => {
        setLoaded(true)
        clearInterval(interval)
      }, 500)
    } else {
      setLoaded(false)
    }
  }

  const updateNotifications = () => {
    setNotificationList(notifications)
  }

  return (
    <div className={styles.container}>
      <div className={styles.notification_list}>
        {notificationList.map(notification => {
          return <Notification {...notification} key={notification.id} />
        })}
      </div>
    </div>
  )
}

NotificationContainer.propTypes = {
  notifications: propTypes.arrayOf(propTypes.object).isRequired,
}

module.exports = NotificationContainer
