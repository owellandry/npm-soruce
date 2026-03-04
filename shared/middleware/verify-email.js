'use strict'

module.exports = () => ({
  processRehydrate(props, session, next) {
    const {router, store} = session

    router.events.on('route', harass)

    return next().then(harass)

    function harass() {
      const {user, userEmailVerified} = store.getState().props
      if (user && !userEmailVerified) {
        store.dispatch({
          type: 'NOTIFICATION_SHOW',
          level: 'warning',
          message: 'You have not verified your email address.',
          link: {
            action: {
              type: 'RESEND_VERIFICATION_EMAIL',
            },
            text: 'Do you need us to send it again?',
          },
        })
      }
    }
  },
})
