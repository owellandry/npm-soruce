'use strict'

const React = require('react')
const styles = require('./tabs.css')
const PropTypes = require('prop-types')
const Link = require('@npm/spiferack/link')
const connect = require('../connect')
const {activateArrowKeyNavigation} = require('../../utils/accessibility')

function Tabs({links, colors, active, dispatch, ariaLabel}) {
  const tabIds = links.map(({key}) => `package-tab-${key}`)
  const tabList = React.createRef()

  React.useEffect(() => {
    const {deactivate} = activateArrowKeyNavigation(tabList.current, 'li > a', {
      horizontal: true,
      vertical: false,
    })
    return deactivate
  }, [])

  return (
    <ul className={styles.tabs} role="tablist" aria-owns={tabIds.join(' ')} ref={tabList}>
      {links.map(({href, label, key}, index) => {
        const selected = active === key
        const color = colors[index % colors.length]
        let classes = `${styles.tab} ${styles[color]}`
        if (selected) classes += ` ${styles.tabActive}`
        const url = href || `?activeTab=${key}`
        return (
          <li className={classes} key={key} role="presentation">
            {href ? (
              <Link>
                <a
                  className={styles.tabLink}
                  href={href}
                  aria-selected={selected}
                  role="tab"
                  aria-controls={`tabpanel-${key === 'code' ? 'explore' : key}`}
                  aria-label={ariaLabel}
                  id={`package-tab-${key}`}
                  tabIndex={key === active ? 0 : -1}
                >
                  {label}
                </a>
              </Link>
            ) : (
              <a
                className={styles.tabLink}
                href={url}
                aria-selected={selected}
                onClick={tabClick(key, url)}
                role="tab"
                aria-controls={`tabpanel-${key === 'code' ? 'explore' : key}`}
                aria-label={ariaLabel}
                id={`package-tab-${key}`}
                tabIndex={key === active ? 0 : -1}
              >
                {label}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )

  function tabClick(key, url) {
    return ev => {
      if (ev.ctrlKey) return
      ev.preventDefault()
      window.history.pushState({}, '', `${url}`)
      dispatch({type: 'PACKAGE_TAB', activeTab: key})
      dispatch({type: 'TAB_CLICKED', tabClicked: true})
    }
  }
}

Tabs.defaultProps = {
  colors: ['red', 'yellow', 'green', 'violet', 'purple', 'teal'],
}

Tabs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.oneOf(Tabs.defaultProps.colors)),
}

module.exports = connect()(Tabs)
module.exports.component = Tabs
