/** @typedef {import('../../types/package-linking').AutolinkPollingReply} AutolinkPollingReply */

const Router = require('@npm/spiferack/router')

const fetch = require('../actions/fetch')
const showNotification = require('../actions/show-notification')

const POLL_INTERVAL = 3 * 1000 // 3 seconds
const MAX_RETRIES = 20 // ~ 1 min
const POLL_URL = '/settings/packages/autolink'

function dropPageParams(pathname, query) {
  if (!query) {
    return pathname
  }

  const params = new URLSearchParams(query)
  params.delete('page')
  params.delete('perPage')

  return `${pathname}?${params.toString()}`
}

function reloadState() {
  const router = Router.get()
  // Removing page params because current page might not be available already (less items in unlinked tab)
  const path = dropPageParams(router.pathname, router.query)
  router.go(path, {replaceState: true})
}

const delay = interval => new Promise(resolve => setTimeout(resolve, interval))

module.exports = {
  PACKAGE_AUTO_LINK_WATCH: async (dispatch, {abortSignal, pollInterval = POLL_INTERVAL}) => {
    const handleError = () => {
      dispatch({type: 'PACKAGE_AUTO_LINK_ERROR'})
      dispatch(showNotification({message: 'There was an error with auto linking packages', duration: 5000}))
    }

    try {
      let tries = 0

      while (!abortSignal.aborted) {
        /** @type {AutolinkPollingReply} */
        const {status} = await dispatch(fetch(POLL_URL, {method: 'GET'}))
        if (status === 'done') {
          reloadState()
          return
        }
        if (++tries >= MAX_RETRIES) {
          handleError()
          return
        }

        await delay(pollInterval)
      }
    } catch (err) {
      handleError()
    }
  },
}
