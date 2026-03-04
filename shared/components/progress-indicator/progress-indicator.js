'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./progress-indicator.css')

function ProgressIndicator(props) {
  const className = `${props.className} ${styles.container}`
  const progressTrackClassName = props.trackClassName || styles.track
  const iconClassName = props.iconClassName || styles.icon

  return (
    <div className={className}>
      <div className={styles.iconsContainer}>
        <ul className={styles.icons}>
          {props.icons.reduce((icons, icon, index) => {
            icons.push(
              <li className={iconClassName} key={`progress-step-${index}`}>
                <div className={styles.labelOuter}>
                  <div className={styles.labelInner}>{props.labels[index]}</div>
                </div>
                {icon}
              </li>,
            )
            if (index + 1 < props.icons.length) {
              icons.push(<li className={progressTrackClassName} key={`track-${index}`} />)
            }
            return icons
          }, [])}
        </ul>
      </div>
    </div>
  )
}

ProgressIndicator.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.node).isRequired,
  icons: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  trackClassName: PropTypes.string,
  iconClassName: PropTypes.string,
}

module.exports = ProgressIndicator
