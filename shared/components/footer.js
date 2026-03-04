'use strict'

const React = require('react')
const StaticComponent = require('./static')
const Link = require('@npm/spiferack/link')

const styles = require('../styles/footer.css')
const GitHubIcon = require('./icons/github')

const STATIC_PAGE_BASE_URL = process.env.STATIC_PAGE_BASE_URL || ''

class Footer extends StaticComponent {
  shouldComponentUpdate(prevProps) {
    return prevProps.hasMarginTop !== this.props.hasMarginTop
  }

  render() {
    const footerStyle = this.props.hasMarginTop ? `${styles.footer} mt4` : styles.footer
    return (
      <footer className={footerStyle}>
        <h2 className={styles.srOnly}>Footer</h2>
        <div id="footer" className="center mw9 pa3 flex flex-column flex-wrap-m flex-row-ns">
          <div className="flex-auto pa4-ns pa3 w-100 w-10-l">
            <div className={styles.footerBlockLogo}>
              <a
                target="_blank"
                rel="noopener noreferrer nofollow"
                href="https://github.com/npm"
                aria-label="Visit npm GitHub page"
              >
                <svg viewBox="0 0 27.23 27.23" aria-hidden="true">
                  <rect fill="#333333" width="27.23" height="27.23" rx="2" />
                  <polygon
                    fill="#fff"
                    points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"
                  />
                </svg>
              </a>
            </div>
            <div className={styles.footerBlockLogo}>
              <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com" aria-label="GitHub">
                <GitHubIcon size={50} />
              </a>
            </div>
          </div>
          <div className="flex-auto pa4-ns pa3 w-30-ns w-50-m">
            <h3 id="support" className={styles.footerMenuTitle}>
              Support
            </h3>
            <ul className="list pl0" aria-labelledby="support">
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="https://docs.npmjs.com">
                    Help
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="https://github.com/advisories">
                    Advisories
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="http://status.npmjs.org/">
                    Status
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="/support" target="_self">
                    Contact npm
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-auto pa4-ns pa3 w-30-ns w-50-m">
            <h3 id="company" className={styles.footerMenuTitle}>
              Company
            </h3>
            <ul className="list pl0" aria-labelledby="company">
              <li className="pv1">
                <Link>
                  <a className={styles.link} href={`${STATIC_PAGE_BASE_URL}/about`} target="_self">
                    About
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="https://github.blog/tag/npm/">
                    Blog
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href="/press">
                    Press
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex-auto pa4-ns pa3 w-30-ns w-50-m">
            <h3 id="terms" className={styles.footerMenuTitle}>
              Terms & Policies
            </h3>
            <ul className="list pl0" aria-labelledby="terms">
              <li className="pv1">
                <Link>
                  <a className={styles.link} href={`${STATIC_PAGE_BASE_URL}/policies/`}>
                    Policies
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href={`${STATIC_PAGE_BASE_URL}/policies/terms`}>
                    Terms of Use
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href={`${STATIC_PAGE_BASE_URL}/policies/conduct`}>
                    Code of Conduct
                  </a>
                </Link>
              </li>
              <li className="pv1">
                <Link>
                  <a className={styles.link} href={`${STATIC_PAGE_BASE_URL}/policies/privacy`}>
                    Privacy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    )
  }
}

Footer.defaultProps = {
  hasMarginTop: true,
}

module.exports = Footer
