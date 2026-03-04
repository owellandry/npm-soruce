'use strict'

const {updateIn, chain, getIn, assocIn, assoc, dissoc} = require('icepick')

const showNotification = require('./actions/show-notification')
const fetch = require('./actions/fetch')

module.exports = {
  createCrudRunnersFor,
  createCrudHandlersFor,
}

const fail = Symbol.for('fail')

function createCrudRunnersFor(prefix) {
  const runners = {}

  ;['ADD', 'RM', 'UPDATE'].forEach(method => {
    runners[`${prefix}_${method}`] = async (dispatch, opts) => {
      const {action, item, body = item} = opts
      dispatch({type: `${prefix}_${method}_PENDING`, item})
      dispatch({type: 'ROUTE_START'})
      const result = await dispatch(
        fetch(action, {
          method: 'POST',
          body,
        }),
      ).catch(e => {
        if (e.statusCode > 499) throw e
        dispatch({type: 'ROUTE_COMPLETE'})
        // Duplicates are rejected before being admitted,
        // so we can forego removing them on 409 Conflict
        // errors.
        if (e.statusCode !== 409) {
          dispatch({type: `${prefix}_${method}_ERROR`, item})
        }
        dispatch(showNotification(e))
        return fail
      })

      if (result === fail) return

      dispatch({type: 'ROUTE_COMPLETE'})
      dispatch({
        type: `${prefix}_${method}_COMPLETE`,
        item: method === 'RM' ? item : result,
      })

      if (result.message) {
        dispatch(showNotification(result))
      }
    }
  })

  return runners
}

function createCrudHandlersFor(opts) {
  const {
    prefix,
    // uris,
    targetPropertyChain = ['props', 'list'],
    identify = defaultIdentify,
    extraHandlers = {},
  } = opts
  const handlers = {
    // Add
    [`${prefix}_ADD_PENDING`]: (prevState, {item}) => {
      const existing = getIn(prevState, [...targetPropertyChain, 'objects']).some(xs => identify(xs, item))
      if (existing) {
        // it's an update, call that handler instead
        return prevState
      }
      item = assoc(item, 'pending', true)
      const nextState = updateIn(prevState, [...targetPropertyChain, 'objects'], last => [item, ...last])
      return updateIn(nextState, [...targetPropertyChain, 'total'], n => n + 1)
    },

    [`${prefix}_ADD_COMPLETE`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      if (idx < 0) return prevState
      return assocIn(prevState, [...targetPropertyChain, 'objects', idx], item)
    },

    [`${prefix}_ADD_ERROR`]: (prevState, {item}) => {
      const nextState = updateIn(prevState, [...targetPropertyChain, 'objects'], list => {
        return list.filter(xs => !identify(xs, item))
      })
      return updateIn(nextState, [...targetPropertyChain, 'total'], n => n - 1)
    },

    // Remove
    [`${prefix}_RM_PENDING`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      return assocIn(prevState, [...targetPropertyChain, 'objects', idx, 'pending'], true)
    },

    [`${prefix}_RM_COMPLETE`]: (prevState, {item}) => {
      const nextState = updateIn(prevState, [...targetPropertyChain, 'objects'], list => {
        return list.filter(xs => !identify(xs, item))
      })
      return updateIn(nextState, [...targetPropertyChain, 'total'], n => n - 1)
    },

    [`${prefix}_RM_ERROR`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      return updateIn(prevState, [...targetPropertyChain, 'objects', idx], obj => dissoc(obj, 'pending'))
    },

    // Update
    [`${prefix}_UPDATE_PENDING`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      return assocIn(prevState, [...targetPropertyChain, 'objects', idx, 'pending'], true)
    },

    [`${prefix}_UPDATE_COMPLETE`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      if (idx < 0) return prevState
      return updateIn(prevState, [...targetPropertyChain, 'objects', idx], obj => {
        return chain(obj).dissoc('pending').merge(item).value()
      })
    },

    [`${prefix}_UPDATE_ERROR`]: (prevState, {item}) => {
      const idx = findItemIndex(prevState, item)
      return updateIn(prevState, [...targetPropertyChain, 'objects', idx], obj => dissoc(obj, 'pending'))
    },
  }

  for (const event in extraHandlers) {
    const eventName = `${prefix}_${event}`
    const baseHandler = handlers[eventName]
    const extraHandler = extraHandlers[event]
    handlers[eventName] = (state, action) => extraHandler(baseHandler(state, action), action)
  }
  return handlers

  function findItemIndex(prevState, item) {
    const list = getIn(prevState, [...targetPropertyChain, 'objects'])
    return list.findIndex(xs => identify(xs, item))
  }
}

function defaultIdentify(lhs, rhs) {
  return lhs.name === rhs.name
}
