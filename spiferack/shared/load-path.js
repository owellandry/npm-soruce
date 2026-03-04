'use strict'
let FormData

module.exports = requestTarget

function requestTarget(url, {manifestHash, headerName, method = 'GET', data = null}) {
  FormData = require('formdata-polyfill')
  const xhr = new window.XMLHttpRequest()
  const deferredRendererName = {}
  deferredRendererName.promise = new Promise((resolve, reject) => {
    deferredRendererName.resolve = resolve
  })
  const deferredContext = {}
  deferredContext.promise = new Promise((resolve, reject) => {
    deferredContext.resolve = resolve
    deferredContext.reject = reject
  })
  const deferredPushState = {}
  deferredPushState.promise = new Promise((resolve, reject) => {
    deferredPushState.resolve = resolve
    deferredPushState.reject = reject
  })

  const abort = xhr.abort

  xhr.abort = () => {
    if (xhr.onabort) {
      xhr.onabort()
    }
    abort.call(xhr)
  }
  xhr.onabort = function () {
    deferredContext.resolve(null)
    deferredRendererName.resolve(null)
  }
  xhr.open(method, url)
  xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest')
  xhr.setRequestHeader('manifest-hash', manifestHash)
  xhr.setRequestHeader(headerName, '1')

  if (data && !isFormData(data)) {
    data = JSON.stringify(data)
    xhr.setRequestHeader('content-type', 'application/json')
  }

  xhr.send(getFormData(data))

  xhr.onreadystatechange = function () {
    switch (xhr.readyState) {
      case 2:
        return onheaders()
      case 4:
        return onparsed()
    }
  }

  return {
    xhr,
    getRendererName: deferredRendererName.promise,
    getContext: deferredContext.promise,
    getPushState: deferredPushState.promise,
  }

  function onheaders() {
    const responseManifest = xhr.getResponseHeader('manifest-hash')
    const rendererName = xhr.getResponseHeader('renderername')
    const pushState = xhr.getResponseHeader('push-state')
    // if we're making a post, we can't simply reload the next page.
    // wait for their next navigation.
    if (method === 'GET' && (responseManifest !== manifestHash || !rendererName)) {
      xhr.abort()
      window.location = url
      return
    }
    deferredRendererName.resolve(rendererName)
    deferredPushState.resolve(pushState)
  }

  function onparsed() {
    try {
      const parsed = JSON.parse(xhr.responseText)
      if (parsed && parsed['x-spiferack-redirect']) {
        window.location = xhr.getResponseHeader('location')
        return
      }

      deferredContext.resolve(parsed)
    } catch (err) {
      deferredContext.reject(err)
    }
  }
}

function isFormData(fd) {
  return fd instanceof window.FormData || fd instanceof FormData
}

function getFormData(fd) {
  if (!isFormData(fd)) return fd
  return fd instanceof FormData ? fd._asNative() : fd
}
