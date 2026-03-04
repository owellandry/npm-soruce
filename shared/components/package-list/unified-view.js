'use strict'

const React = require('react')
const PackageListItem = require('../package-list-item/package-list-item')
const styles = require('./package-list.css')

function UnifiedView({packages}) {
  return (
    <div className={styles.packageList}>
      <ul className={styles.packageList}>
        {packages
          .filter(pkg => pkg.version)
          .map((pkg, idx) => (
            <li className={styles.noListStyle} key={`pkg-${pkg.name}-${idx}`}>
              <PackageListItem package={pkg} />
            </li>
          ))}
      </ul>
    </div>
  )
}

module.exports = UnifiedView
