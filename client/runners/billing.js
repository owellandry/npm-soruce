'use strict'
const Router = require('@npm/spiferack/router')
const {loadStripe} = require('@stripe/stripe-js/pure')

module.exports = {
  BILLING_UPGRADE: async (dispatch, data) => {
    const stripeKey = data.stripeKey

    // Could be an org scope or user scope
    const scopeToUpgrade = data.scopeName

    const response = await fetch(`/settings/${scopeToUpgrade}/billing/checkout`)
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

  BILLING_DOWNGRADE: (dispatch, {csrftoken}) => {
    return Router.get().submit({
      method: 'POST',
      data: {csrftoken},
    })
  },
}
