'use strict'
const Router = require('@npm/spiferack/router')
const showNotification = require('../actions/show-notification')
const formDataToObj = require('../form-data')
const {loadStripe} = require('@stripe/stripe-js/pure')

module.exports = {
  ORG_CREATE: async (dispatch, data) => {
    const {stripeKey, formData, csrftoken} = data
    const {planType, orgScope, newUser, humanName} = formDataToObj(formData.create)

    if (planType === 'org-plan-free') {
      return createOrg(dispatch, {
        orgScope,
        newUser,
        humanName,
        planType,
        csrftoken,
      })
    }

    // Create a new paid org or convert your user scope to an organization
    try {
      await createOrgWithoutRouting(dispatch, {
        orgScope,
        newUser,
        humanName,
        planType: 'org-plan-free',
        setUpOrgForPayment: true,
        csrftoken,
      })
    } catch (err) {
      // We've already dispatched the error to the user
      return null
    }

    const response = await fetch(`/settings/${orgScope}/billing/checkout`)
    const sessionId = (await response.json()).sessionId
    loadStripe.setLoadParameters({advancedFraudSignals: false})
    const stripePromise = loadStripe(stripeKey)
    const stripe = await stripePromise
    const result = await stripe.redirectToCheckout({
      sessionId,
    })
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      console.log(`error in billing/checkout: ${result.error.message}`)
    }
    return null
  },
}

function createOrgWithoutRouting(dispatch, data) {
  if (!data.orgScope) {
    const message = '"Name of Org" is required'
    dispatch(showNotification({level: 'error', message, link: null, duration: 20000}))
    throw new Error(message)
  }
  return fetch('/org/create?track=orgUpgradeSuccess', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(response => {
    if (!response.ok) {
      let message = `An unexpected error occurred while creating the organization. ${response.status}`
      if (response.status === 409) {
        message = `The organization name '${data.orgScope}' is not available.`
      }

      dispatch(showNotification({level: 'error', message, link: null, duration: 20000}))

      throw new Error(message)
    }
    return response
  })
}

function createOrg(dispatch, data) {
  return Router.get()
    .submit({
      method: 'POST',
      action: '/org/create?track=orgUpgradeSuccess',
      data,
    })
    .catch(err => {
      dispatch(showNotification(err))
    })
}
