'use strict'

module.exports = class Registry {
  constructor({publicPath, initialRendererName, chunks}) {
    this.cache = {}
    this.pending = {}
    this.chunks = chunks
    this.publicPath = publicPath
    this.scriptsAdded = {[initialRendererName]: 1}
  }

  getEntry(name) {
    if (name in this.cache) {
      return Promise.resolve(this.cache[name])
    }

    this.pending[name] = {promise: null, resolve: null}
    this.pending[name].promise = new Promise((resolve, reject) => {
      this.pending[name].resolve = resolve
    })

    if (!this.scriptsAdded[name]) {
      this.scriptsAdded[name] = 1
      const script = document.createElement('script')
      script.crossOrigin = 'anonymous'
      const chunkPath = (Array.isArray(this.chunks[name]) ? this.chunks[name] : [this.chunks[name]]).find(chunk =>
        chunk.match(/\.js$/),
      )
      script.src = `${this.publicPath}${chunkPath}`
      document.body.appendChild(script)
    }

    return this.pending[name].promise
  }

  register(name, module, hot) {
    this.cache[name] = module
    if (this.pending[name]) {
      this.pending[name].resolve(module)
      delete this.pending[name]
    }
    if (hot) this.onAccept()
  }

  onAccept() {}
}
