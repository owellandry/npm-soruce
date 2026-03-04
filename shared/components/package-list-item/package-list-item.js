'use strict'

/** @typedef {import('../../../types/package-linking').PackageLinkingResult} PackageLinkingResult */

const React = require('react')
const PropTypes = require('prop-types')
const {LinkingDetail} = require('../package-linking/elements')
const PackageLinkingButton = require('../package-linking/package-linking-button')
const Avatar = require('@npm/design-system/avatar/avatar')
const styles = require('./package-list-item.css')
const Link = require('@npm/spiferack/link')
const types = require('../../types')
const {a11yOnly} = require('../../styles/global.css')
const lock = require('./lock.svg')
const Octicon = require('@primer/octicons-react')
const {OIDC} = require('@npm/registry-utils/shared-constants')
class PackageListItem extends React.Component {
  render() {
    const {
      package: pkg,
      score,
      searchWord,
      showLinkingInfo,
      autoLinking,
      scope,
      hidePQM,
      search,
      newSearchEnabled,
      downloads,
    } = this.props
    const {name, publisher = {avatars: {}}} = pkg

    const isOidcPublisher =
      publisher.name === OIDC.ACTORS.GITHUB.DISPLAY_NAME || publisher.name === OIDC.ACTORS.GITLAB.DISPLAY_NAME
    const publisherUrl = isOidcPublisher
      ? 'https://gh.io/npm-docs-trusted-publishers'
      : `${pkg.baseUrl || ''}/~${publisher.name}`
    const publisherTarget = isOidcPublisher ? '_blank' : pkg.baseUrl ? 'external-publishers' : '_self'
    const publisherRel = isOidcPublisher ? 'noopener noreferrer' : undefined
    const pkgUrl = `${pkg.baseUrl || ''}/package/${name}`
    const pkgTarget = pkg.baseUrl ? 'external-packages' : '_self'
    const hasPkgKeyword = Boolean(pkg.keywords && pkg.keywords.length)
    const isExactMatch = pkg.name === searchWord
    const showLinking = showLinkingInfo && !pkg.private
    const isPkgFrozen = pkg.freeze_status === 'sanctioned'

    return (
      <section
        className={`${styles.capsule} ${pkg.private ? 'bg-washed-yellow' : ''} ${search ? styles.capsuleSearch : styles.capsuleOther}`}
      >
        <div className={styles.pkgInfoColumn}>
          <div className={styles.dialogForServiceCodeWrapper}>
            <Link>
              <a target={pkgTarget} href={pkgUrl}>
                <img
                  alt=""
                  src={lock}
                  title={pkg.private ? 'private package' : 'public package'}
                  className={pkg.private ? styles.packagePrivateIcon : styles.packagePublicIcon}
                />
                <h3 className={styles.title}>{name}</h3>
              </a>
            </Link>
            {isExactMatch && (
              <span id="pkg-list-exact-match" className={styles.exactMatch}>
                exact match
              </span>
            )}
            {showLinking && !!pkg.repository && <LinkingDetail link={pkg.repository} />}
          </div>
          {pkg.description && <p className={styles.description}>{pkg.description}</p>}
          {hasPkgKeyword && (
            <ul className={styles.keywords}>
              {pkg.keywords
                .filter(item => typeof item === 'string')
                .map(word => {
                  return (
                    <li className={styles.noListStyle} key={word.replace(/\s/, '-')}>
                      <Link>
                        <a
                          href={`/search?q=keywords:${word.includes(' ') ? `"${word}"` : word}`}
                          className={styles.keyword}
                        >
                          {word}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              {pkg.keywordsTruncated && (
                <li className={styles.noListStyle}>
                  <Link>
                    <a href={`${pkgUrl}#keywords`} className={styles.keyword}>
                      View more
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          )}
          <div className={styles.publisherRow}>
            <div className={styles.avatarWrapper}>
              {publisher.avatars && publisher.avatars.medium && (
                <Avatar src={publisher.avatars.medium} size={22} aria-hidden />
              )}
              <Link>
                <a
                  target={publisherTarget}
                  href={publisherUrl}
                  className={styles.publisherName}
                  aria-label={'publisher ' + publisher.name}
                  rel={publisherRel}
                >
                  {publisher.name}
                </a>
              </Link>
            </div>
            <>
              <span aria-hidden className={styles.publisherString}>
                {newSearchEnabled ? '•' : 'published'} {pkg.version} • {pkg.date && pkg.date.rel}
                {newSearchEnabled && (
                  <>
                    {' '}
                    • <Octicon.PackageIcon /> {pkg.dependents.toLocaleString()} dependents
                    {pkg.license && (
                      <>
                        {' '}
                        • <Octicon.LawIcon /> {pkg.license}
                      </>
                    )}
                  </>
                )}
              </span>

              <span className={a11yOnly}>
                published version {pkg.version}
                {pkg.date && <>, {pkg.date.rel}</>}
                {newSearchEnabled && (
                  <>
                    {pkg.dependents} dependents {pkg.license && <>licensed under ${pkg.license}</>}
                  </>
                )}
              </span>
            </>
          </div>
        </div>
        <div className={`${styles.pkgLinkingColumn} ${newSearchEnabled ? '' : styles.pkgLinkingColumnLegacy}`}>
          {showLinking && !autoLinking && !pkg.repository && !isPkgFrozen && (
            <PackageLinkingButton className={'justify-end-l'} package={pkg} scope={scope} />
          )}
          {score && !hidePQM && <RankingMetrics {...score.detail} />}
          {newSearchEnabled && (
            <>
              <Octicon.DownloadIcon aria-label="Download statistics" />
              <div style={{paddingLeft: 8}}>{downloads.toLocaleString()}</div>
            </>
          )}
        </div>
      </section>
    )
  }
}

function RankingMetrics({quality, popularity, maintenance, hidePQM}) {
  if (hidePQM) {
    return null
  }
  const maintenanceText = `Maintenance: ${maintenance === 0 ? 'None' : `${Math.round(maintenance * 100)}%`}`
  const qualityText = `Quality: ${quality === 0 ? 'None' : `${Math.round(quality * 100)}%`}`
  const popularityText = `Popularity: ${popularity === 0 ? 'None' : `${Math.round(popularity * 100)}%`}`

  return (
    <div className={styles.metrics}>
      <RankingMetric value={maintenance} label="Maintenance" className={styles.colorMaintenance} />
      <RankingMetric value={quality} label="Quality" className={styles.colorQuality} />
      <RankingMetric value={popularity} label="Popularity" className={styles.colorPopularity} />
      <p className={styles.srOnly}>
        {maintenanceText}. {qualityText}. {popularityText}.
      </p>
    </div>
  )
}

function RankingMetric({value, label, className}) {
  return (
    <div className={styles.metric} aria-hidden="true">
      <div
        className={`${styles.metricBar} ${className}`}
        style={{
          transform: `scaleX(${value})`,
        }}
      />
      <abbr className={styles.metricLetter} aria-label={label} title={label}>
        {label[0]}
      </abbr>
    </div>
  )
}

PackageListItem.propTypes = {
  package: types.packageListItem,
  score: PropTypes.object,
  scope: PropTypes.string,
  showLinkingInfo: PropTypes.bool,
  autoLinking: PropTypes.bool,
}

module.exports = PackageListItem
