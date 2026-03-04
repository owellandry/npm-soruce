'use strict'

module.exports = createMetricsMiddleware

function createMetricsMiddleware() {
  return {
    processRehydrate(props, session, next) {
      setInterval(() => {
        process.emit('metric', {
          heaptotal: window.performance.totalJSHeapSize,
        })

        process.emit('metric', {
          heapused: window.performance.usedJSHeapSize,
        })
      }, 30000)

      process.on('metric', metric => {
        if (!metric.name) {
          return
        }
        record(metric)
      })

      return next()
    },
  }
}

const METRICS_ENDPOINT = process.env.CLIENTSIDE_METRICS_ENDPOINT
const MAX_VALUES = process.env.CLIENTSIDE_METRICS_MAX_VALUES
const MAX_KEYLEN = process.env.CLIENTSIDE_METRICS_MAX_KEYLEN

let unpickled = null
let storing = null
let sending = null

function record(what) {
  unpickle().then(metrics => {
    const offset = Date.now() - metrics.e
    what.o = offset

    const out = {}
    for (const key in what) {
      const curIdx = metrics.k.indexOf(key)
      const idx = curIdx === -1 ? addKey(metrics, key) : curIdx
      out[idx] = what[key]
    }

    metrics.v.push(out)
    store(metrics)
  })
}

// storage:
// e: "epoch" -- when did we start collecting this round of metrics
// v: list of values objects
//    each key of a value object is a number corresponding to a key in k
//    each value object has "o" -- offset from epoch (store smaller numbers)
// k: list of keys
function createMetrics() {
  return {e: Date.now(), v: [], k: [], kv: 0}
}

function addKey(metrics, key) {
  const idx = metrics.k.push(key) - 1
  metrics.kv += key.length
  return idx
}

function unpickle() {
  if (unpickled) {
    return unpickled
  }

  // using "resolve()" here to run on the next microtask
  unpickled = Promise.resolve().then(() => {
    const stored = window.localStorage.getItem('npm:metrics') || '{}'
    const candidate = JSON.parse(stored)

    return typeof candidate.e === 'number' && typeof candidate.kv === 'number' && Array.isArray(candidate.v)
      ? candidate
      : createMetrics()
  })
  return unpickled
}

function store(metrics) {
  if (metrics.v.length > MAX_VALUES || metrics.kv > MAX_KEYLEN) {
    return flush(metrics)
  }

  if (storing) {
    return
  }

  storing = Promise.resolve().then(() => {
    window.localStorage.setItem('npm:metrics', JSON.stringify(metrics))
    storing = null
  })

  return storing
}

function flush(metrics) {
  const copy = Object.assign({}, metrics)
  Object.assign(metrics, createMetrics())
  window.localStorage.setItem('npm:metrics', JSON.stringify(metrics))
  return send(copy)
}

function send(metrics) {
  sending = new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open('POST', METRICS_ENDPOINT)
    xhr.send(JSON.stringify(metrics))
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve()
      }
    }
  }).then(
    () => {
      sending = null
    },
    () => {},
  )

  return sending
}
