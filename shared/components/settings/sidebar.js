'use strict'

const Link = require('@npm/spiferack/link')
const PropTypes = require('prop-types')
const React = require('react')
const UserIcon = require('../icons/user')
const CogIcon = require('../icons/cog')
const CreditCardIcon = require('../icons/credit-card')
const CoinsIcon = require('../icons/coins')
const BoxesIcon = require('../icons/boxes')
const styles = require('./sidebar.css')
const FileIcon = require('../icons/file')

class SettingsSidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPath: '',
    }
  }

  componentDidMount() {
    this.setState({currentPath: this.props.router.pathname})
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.props.router.pathname !== prevState.currentPath) {
      this.setState({currentPath: this.props.router.pathname})
    }
  }

  render() {
    const {memberships = {objects: []}, user, scope, auditLogEnabled} = this.props
    const hasMemberships = !!memberships.objects.length
    const scopeName = scope.parent.name
    const {currentPath} = this.state
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.srOnly}>Sidebar</h2>
        <div className={styles.sticky}>
          <nav aria-label="Settings navigation">
            <ul className={styles.list} role="list">
              <li className={`${styles.listItem}`}>
                <Link>
                  <a
                    href={`/~${user.name}`}
                    className={styles.link}
                    aria-current={currentPath === `/~${user.name}` ? 'page' : undefined}
                  >
                    <UserIcon /> Profile
                  </a>
                </Link>
              </li>
              <li className={`${styles.listItem}`}>
                <Link>
                  <a
                    href={`/settings/${user.name}/packages`}
                    className={styles.link}
                    aria-current={currentPath.includes('/packages') ? 'page' : undefined}
                  >
                    <BoxesIcon /> Packages
                  </a>
                </Link>
              </li>
              <li className={`${styles.listItem}`}>
                <Link>
                  <a
                    href={`/settings/${user.name}/profile`}
                    className={styles.link}
                    aria-current={currentPath.includes('/profile') ? 'page' : undefined}
                  >
                    <CogIcon /> Account
                  </a>
                </Link>
              </li>
              <li className={`${styles.listItem}`}>
                <Link>
                  <a
                    href={`/settings/${user.name}/billing`}
                    className={styles.link}
                    aria-current={currentPath.includes('/billing') ? 'page' : undefined}
                  >
                    <CreditCardIcon /> Billing Info
                  </a>
                </Link>
              </li>
              <li className={`${styles.listItem}`}>
                <Link>
                  <a
                    href={`/settings/${user.name}/tokens`}
                    className={styles.link}
                    aria-current={currentPath.includes('/tokens') ? 'page' : undefined}
                  >
                    <CoinsIcon /> Access Tokens
                  </a>
                </Link>
              </li>
              {auditLogEnabled && (
                <li className={`${styles.listItem} ${styles.auditLogLink}`}>
                  <Link>
                    <a
                      href={`/settings/${user.name}/audit-logs`}
                      className={styles.link}
                      aria-current={currentPath.includes('/audit-logs') ? 'page' : undefined}
                    >
                      <FileIcon /> Audit Logs
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className={styles.header}>
            <h3 id="organizationsHeader">Organizations</h3>
            <Link>
              <a href="/org/create" className={styles.addLink}>
                <span aria-hidden="true">+</span>
                <span className={styles.srOnly}>Create New Organization</span>
              </a>
            </Link>
          </div>

          {hasMemberships ? (
            <ul aria-labelledby="organizationsHeader" className={styles.list} role="list">
              {memberships.objects.map(uo => {
                const active = uo.org.name === scopeName
                return (
                  <li
                    className={`${styles.listItem} ${active ? styles.active : ''}`}
                    key={uo.org.name}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Link>
                      <a href={`/settings/${uo.org.name}/packages`} className={styles.link}>
                        <span />
                        <span>{uo.org.name}</span>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>None</p>
          )}
        </div>
      </aside>
    )
  }
}

SettingsSidebar.propTypes = {
  memberships: PropTypes.shape({
    total: PropTypes.number,
    objects: PropTypes.array.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
}

module.exports = SettingsSidebar
