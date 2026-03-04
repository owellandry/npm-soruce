'use strict'
const React = require('react')
const styles = require('./header.css')
const connect = require('../connect')
const FadeIn = require('../transitions/fade-in')
const Link = require('@npm/spiferack/link')
const UserIcon = require('../icons/user')
const CogIcon = require('../icons/cog')
const CreditCardIcon = require('../icons/credit-card')
const CoinsIcon = require('../icons/coins')
const PlusIcon = require('../icons/plus')
const BoxesIcon = require('../icons/boxes')
const LogoutIcon = require('../icons/logout')
const FileIcon = require('../icons/file')
const DropdownCaret = require('../icons/dropdown-caret')
const {a11yOnly} = require('../../styles/global.css')

class User extends React.PureComponent {
  constructor(props) {
    super(props)

    this.dropdownNav = React.createRef()
    this.dropdownCaretButton = React.createRef()

    this.keydownHandler = this.keydownHandler.bind(this)
    this.openDropdown = this.openDropdown.bind(this)
    this.closeDropDown = this.closeDropDown.bind(this)
    this.handleFocusOutside = this.handleFocusOutside.bind(this)
  }

  openDropdown() {
    this.props.dispatch({type: 'NOTIFICATION_CLOSE_ALL'})
    this.props.dispatch({type: 'USER_DROPDOWN_TOGGLE'})
  }

  closeDropDown() {
    this.props.dispatch({type: 'USER_DROPDOWN_CLOSE'})
  }

  keydownHandler(ev) {
    switch (ev.key) {
      case 'Escape':
        if (this.dropdownCaretButton.current) {
          this.dropdownCaretButton.current.focus()
          this.closeDropDown()
        }
        break
    }
  }

  componentDidMount() {
    if (this.dropdownNav.current) {
      this.dropdownNav.current.addEventListener('keydown', this.keydownHandler)
    }
    document.addEventListener('mousedown', this.handleFocusOutside)
    document.addEventListener('focusin', this.handleFocusOutside)
  }

  componentWillUnmount() {
    if (this.dropdownNav.current) {
      this.dropdownNav.current.removeEventListener('keydown', this.keydownHandler)
    }
    document.removeEventListener('mousedown', this.handleFocusOutside)
    document.removeEventListener('focusin', this.handleFocusOutside)
  }

  handleFocusOutside(event) {
    if (!(this.dropdownNav.current && this.dropdownNav.current.contains(event.target))) {
      this.closeDropDown()
    }
  }

  render() {
    const {user, userDropdownOpen, auditLogEnabled} = this.props
    return (
      <div className={styles.user}>
        {user && (
          <nav ref={this.dropdownNav}>
            <button
              ref={this.dropdownCaretButton}
              onClick={this.openDropdown}
              className={styles.dropdownButton}
              aria-expanded={userDropdownOpen}
              aria-label="Profile menu"
            >
              <span className={a11yOnly}>Menu</span>
              <Gravatar {...user.avatars} />
              <div className="pl1" aria-hidden>
                <DropdownCaret />
              </div>
            </button>
            <Dropdown user={user} open={userDropdownOpen} auditLogEnabled={auditLogEnabled} />
          </nav>
        )}
        {!user && <Login />}
      </div>
    )
  }
}

function Login() {
  return (
    <div className={styles.userLogin}>
      <a href="/signup" id="signup" className={styles.userLinkJoin}>
        Sign Up
      </a>
      <a href="/login" id="signin" className={styles.userLinkLogin}>
        Sign In
      </a>
    </div>
  )
}

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.dropdownList = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open && this.dropdownList.current) {
      this.dropdownList.current.querySelector('li > a').focus()
    }
  }

  onBlurDropdown(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this.props.onBlur(event)
    }
  }

  render() {
    const {user, open, auditLogEnabled} = this.props
    return (
      <FadeIn>
        <div className={styles.userDropdown} hidden={!open}>
          <h2 className={styles.userDropdownHeader}>
            <span className={styles.userName}>
              <UserIcon /> {user.name}
            </span>
          </h2>
          <ul className="list ph0 ma0 mt2" ref={this.dropdownList}>
            <li className={styles.userDropdownRow} key="profile">
              <Link>
                <a className={styles.userDropdownLink} href={`/~${user.name}`}>
                  <UserIcon /> Profile
                </a>
              </Link>
            </li>
            <li className={styles.userDropdownRow} key="packages">
              <Link>
                <a className={styles.userDropdownLink} href={`/settings/${user.name}/packages`}>
                  <BoxesIcon /> Packages
                </a>
              </Link>
            </li>
            <li className={styles.userDropdownRow} key="settings">
              <Link>
                <a className={styles.userDropdownLink} href={`/settings/${user.name}/profile`}>
                  <CogIcon /> Account
                </a>
              </Link>
            </li>
            <li className={`${styles.userDropdownRow}`} key="billing">
              <Link>
                <a className={styles.userDropdownLink} href={`/settings/${user.name}/billing`}>
                  <CreditCardIcon /> Billing Info
                </a>
              </Link>
            </li>
            <li className={styles.userDropdownRow} key="tokens">
              <Link>
                <a className={styles.userDropdownLink} href={`/settings/${user.name}/tokens`}>
                  <CoinsIcon /> Access Tokens
                </a>
              </Link>
            </li>
            {auditLogEnabled && (
              <li className={`${styles.userDropdownRow} ${styles.auditLogLink}`} key="audit-logs">
                <Link>
                  <a className={styles.userDropdownLink} href={`/settings/${user.name}/audit-logs`}>
                    <FileIcon /> Audit Logs
                  </a>
                </Link>
              </li>
            )}
            <li className={`${styles.userDropdownRow} ${styles.luminosityRatio}`} key="create-org">
              <Link>
                <a className={styles.createOrgButton} href={'/org/create'}>
                  <PlusIcon /> Add Organization
                </a>
              </Link>
            </li>
            <li className={styles.userDropdownRow} key="sign-out">
              <Link>
                <a className={styles.userDropdownLink} href="/logout">
                  <LogoutIcon /> Sign Out
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </FadeIn>
    )
  }
}

function Gravatar(avatar) {
  return <img alt="avatar" className={styles.gravatar} src={avatar.small} aria-hidden />
}

User.Dropdown = Dropdown

module.exports = connect()(User)
