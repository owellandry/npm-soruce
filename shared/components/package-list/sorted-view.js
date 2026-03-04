'use strict'
const React = require('react')
const omit = require('lodash/omit')
const {TabNav, CounterLabel} = require('@primer/react')
const Link = require('@npm/spiferack/link')
const connect = require('../connect')
const PackageListItem = require('../package-list-item/package-list-item')
const Spinner = require('../spinner/spinner')
const styles = require('./package-list.css')
const withThemeProvider = require('../theme-provider')
const {GeneralLinkingButton} = require('../package-linking/elements')
const {PlusIcon, PlugIcon} = require('@primer/octicons-react')
const {announce} = require('../../utils/aria-live')

const tabs = [
  {id: 'unlinked', url: 'unlinked', label: 'Unlinked'},
  {id: 'linked', url: 'linked', label: 'Linked'},
  {id: 'all', url: 'all', label: 'All'},
]

const Tabs = withThemeProvider(
  ({scope, pkgsCounts, selectedTab, autoLinkingUrl, canEditScopeTeams, addPackageLink}) => (
    <div className="flex flex-wrap bb b--black-10">
      <TabNav aria-label="Packages" className={styles.tabs}>
        {tabs.map(({id, url, label}) => (
          <Link key={id}>
            <TabNav.Link
              href={`/settings/${scope}/packages?selectedTab=${url}`}
              className={id === selectedTab ? styles.selectedTab : undefined}
            >
              {label} <CounterLabel>{pkgsCounts[id]}</CounterLabel>
            </TabNav.Link>
          </Link>
        ))}
      </TabNav>
      <div className="flex flex-wrap items-center">
        {autoLinkingUrl && (
          <GeneralLinkingButton href={autoLinkingUrl} className={'ml2'}>
            <PlugIcon />
            Configure package linking
          </GeneralLinkingButton>
        )}
        {canEditScopeTeams && (
          <GeneralLinkingButton href={addPackageLink} className={'ml2'}>
            <PlusIcon />
            Add Package
          </GeneralLinkingButton>
        )}
      </div>
    </div>
  ),
)

class SortedView extends React.Component {
  /** @type Set<string> */
  pendingLinking = new Set()

  autolinkWatchController

  componentDidMount() {
    const {autoLinkingPending} = this.props

    if (autoLinkingPending) {
      this.checkAutolinkStatus()
    }

    announce('Packages')
  }

  redirectToPreviousPkgView() {
    const params = new URLSearchParams(window.location.search)
    const currentPage = parseInt(params.get('page') || '0', 10)
    if (currentPage) {
      params.set('page', `${currentPage - 1}`)
      window.location.replace(`${window.location.origin}${window.location.pathname}?${params.toString()}`)
    }
  }

  noMorePackagesToLinkInView() {
    const {selectedTab, packages} = this.props
    return selectedTab === 'unlinked' && packages.every(pkg => pkg.repository)
  }

  componentDidUpdate(prevProps) {
    if (this.noMorePackagesToLinkInView()) {
      this.redirectToPreviousPkgView()
    }

    if (this.props.selectedTab !== prevProps.selectedTab) {
      this.pendingLinking.clear()
    }
    this.props.pendingLinking.forEach(p => this.pendingLinking.add(p))
  }

  componentWillUnmount() {
    this.autolinkWatchController && this.autolinkWatchController.abort()
  }

  checkAutolinkStatus() {
    this.autolinkWatchController = new window.AbortController()
    const {dispatch} = this.props

    dispatch('PACKAGE_AUTO_LINK_WATCH', {
      abortSignal: this.autolinkWatchController.signal,
    })
  }

  packageLinkingSuccessful(pkg) {
    const {selectedTab} = this.props
    return selectedTab === 'unlinked' && pkg.repository && this.pendingLinking.has(pkg.name)
  }

  autoLinkingPendingView() {
    return (
      <div className={styles.overlayLoader}>
        <div>
          <Spinner /> Linking in progress...
        </div>
      </div>
    )
  }

  render() {
    const {packages, autoLinkingPending, scope} = this.props

    return (
      <div className={styles.itemListContainer}>
        <Tabs {...this.props} />
        <ul className={[styles.listEntry, styles.noListStyle].join(' ')}>
          {packages.map((pkg, idx) => {
            const justLinked = this.packageLinkingSuccessful(pkg)
            return (
              <li
                className={[justLinked ? styles.shrinkHeight : null, styles.noListStyle].join(' ')}
                key={`pkg-${pkg.name}-${idx}`}
              >
                <PackageListItem
                  package={justLinked ? omit(pkg, 'repository') : pkg}
                  scope={scope}
                  showLinkingInfo
                  autoLinking={autoLinkingPending}
                />
              </li>
            )
          })}
        </ul>
        {autoLinkingPending && this.autoLinkingPendingView()}
      </div>
    )
  }
}

/**
 * Maps pendingLinking to SortedView props based on store state
 * @params {Object} state - Store state
 */
const linkingPropsMapper = ({props: {linkingStatus = {}}}) => ({
  pendingLinking: Object.entries(linkingStatus)
    .map(([name, status]) => (status && status.pending ? name : undefined))
    .filter(Boolean),
})

module.exports = connect(linkingPropsMapper)(SortedView)
