'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./alert-banner.css')
const AlertBanner = require('./alert-banner')

function AlertBannerContainer({banners = []}) {
  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <section className={styles.alertBannerContainer} aria-label="Site notifications">
      <div className={styles.alertBannerWrapper}>
        {banners.map(banner => (
          <AlertBanner {...banner} key={banner.id} />
        ))}
      </div>
    </section>
  )
}

AlertBannerContainer.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      message: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired,
      link: PropTypes.shape({
        href: PropTypes.string,
        action: PropTypes.object,
        text: PropTypes.string.isRequired,
      }),
      duration: PropTypes.number,
    }),
  ),
}

AlertBannerContainer.defaultProps = {
  banners: [],
}

module.exports = AlertBannerContainer
