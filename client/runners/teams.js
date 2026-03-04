'use strict'
const formDataToObj = require('../form-data')
const fetch = require('../actions/fetch')
const showNotification = require('../actions/show-notification')

module.exports = {
  TEAM_ADD_USER: (dispatch, opts) => {
    const {scopeName, team, formData} = opts
    const body = formDataToObj(formData.addUser)
    const {user} = body
    const item = {user: {name: user}}
    dispatch({type: 'TEAM_MEMBER_ADD_PENDING', item})
    return dispatch(
      fetch(`/settings/${scopeName}/teams/team/${encodeURIComponent(team)}/users`, {
        method: 'POST',
        body,
      }),
    )
      .then(member => {
        if (member.message) {
          // The post error'd
          dispatch({type: 'TEAM_MEMBER_ADD_ERROR', item})
          return
        }
        dispatch({type: 'TEAM_MEMBER_ADD_COMPLETE', item: member})
      })
      .catch(e => {
        dispatch({type: 'TEAM_MEMBER_ADD_ERROR', item})
        throw e
      })
  },
  TEAM_REMOVE_USER: (dispatch, opts) => {
    const {scopeName, team, formData, user} = opts
    const body = formDataToObj(formData[`remove-${user}`])
    const item = {user: {name: user}}
    dispatch({type: 'TEAM_MEMBER_RM_PENDING', item})
    return dispatch(
      fetch(`/settings/${scopeName}/teams/team/${encodeURIComponent(team)}/users/${user}/delete`, {
        method: 'POST',
        body,
      }),
    )
      .then(() => {
        dispatch({type: 'TEAM_MEMBER_RM_COMPLETE', item})
      })
      .catch(e => {
        dispatch({type: 'TEAM_MEMBER_RM_ERROR', item})
        throw e
      })
  },
  TEAM_ADD_PACKAGE: (dispatch, opts) => {
    const {scopeName, team, formData} = opts
    const body = formDataToObj(formData.addPackage)
    const {package: pkg} = body
    const item = {package: {name: pkg}}
    dispatch({type: 'TEAM_PACKAGE_ADD_PENDING', item})
    dispatch({type: 'ROUTE_START'})
    return dispatch(
      fetch(`/settings/${scopeName}/teams/team/${encodeURIComponent(team)}/access`, {
        method: 'POST',
        body,
      }),
    )
      .then(resp => {
        dispatch({type: 'ROUTE_COMPLETE'})
        dispatch({type: 'TEAM_PACKAGE_ADD_COMPLETE', item: resp})
      })
      .catch(e => {
        dispatch({type: 'ROUTE_COMPLETE'})
        dispatch({type: 'TEAM_PACKAGE_ADD_ERROR', item})
        throw e
      })
  },
  TEAM_REMOVE_PACKAGE: (dispatch, opts) => {
    const {action, formData, pkg} = opts
    const body = formDataToObj(formData[`remove-${pkg}`])
    const item = {package: {name: pkg}}
    dispatch({type: 'TEAM_PACKAGE_RM_PENDING', item})
    return dispatch(
      fetch(action, {
        method: 'POST',
        body,
      }),
    )
      .then(() => {
        dispatch({type: 'TEAM_PACKAGE_RM_COMPLETE', item})
      })
      .catch(e => {
        dispatch({type: 'TEAM_PACKAGE_RM_ERROR', item})
        dispatch(showNotification(e))
      })
  },
  TEAM_UPDATE_PACKAGE: (dispatch, opts) => {
    const {pkg, action, permissions} = opts
    const body = {package: pkg, permissions}
    const item = {package: {name: pkg}, permissions}
    dispatch({type: 'TEAM_PACKAGE_UPDATE_PENDING', item})
    return dispatch(
      fetch(action, {
        method: 'POST',
        body,
      }),
    )
      .then(() => {
        dispatch({type: 'TEAM_PACKAGE_UPDATE_COMPLETE', item})
      })
      .catch(e => {
        dispatch({type: 'TEAM_PACKAGE_UPDATE_ERROR', item})
        dispatch(showNotification(e))
      })
  },
}
