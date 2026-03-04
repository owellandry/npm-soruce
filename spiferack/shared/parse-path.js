module.exports = parse

const anchor = typeof document !== 'undefined' ? document.createElement('a') : {}

function parse(path) {
  anchor.href = path
  const {pathname, search, hash, protocol, hostname, port} = anchor
  return {pathname, search, hash, protocol, hostname, port}
}
