/**
 * Light-weight version of Jed Watson's classNames. Serves it's purpose with
 * use of MultiSelect components.
 */
const classNames = (...classes) => {
  return classes.filter(name => name && typeof name !== 'boolean').join(' ')
}

module.exports = classNames
