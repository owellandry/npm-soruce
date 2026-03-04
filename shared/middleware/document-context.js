'use strict'

module.exports = createDocumentContextMiddleware

function createDocumentContextMiddleware() {
  return {
    processRehydrate(props, session, next) {
      const {documentContext = {}} = props

      // load chunks of html as context, useful for readmes!
      for (const path in documentContext) {
        const bits = path.split('.')
        let current = props
        do {
          current = current[bits.shift()]
        } while (current && bits.length > 1)
        const el = document.getElementById(documentContext[path])
        if (!el || !current) {
          continue
        }
        current[bits[0]] = el.innerHTML
      }

      return next()
    },
  }
}
