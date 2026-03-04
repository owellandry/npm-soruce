'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const CallToAction = require('../../components/call-to-action/call-to-action')
const Dialog = require('../../components/dialog/dialog')
const GitHubIcon = require('../icons/github')
const styles = require('./banners.css')
const Banner = require('../banner/banner')
const bannerStyles = require('../banner/banner.css')

module.exports = {
  HomepageInitiateAutolinkingBanner,
  PackagePageInitiateAutolinkingBanner,
  HomepageInitiateMFABanner,
}

function goToURL(href) {
  window.location = href
}

function GitHubContinue() {
  return (
    <span>
      <GitHubIcon verticalAlign="sub" className={styles.ghIcon} size={15} />
      Continue
    </span>
  )
}

function ConfirmDialog({dialogIsOpen, setDialogIsOpen, href}) {
  return (
    <Dialog
      isOpen={dialogIsOpen}
      headerText="Leaving this page"
      ariaLabelledBy="Leaving this page to install npm app on GitHub"
      cancelText="Cancel"
      doActionText={<GitHubContinue />}
      onDismiss={() => setDialogIsOpen(false)}
      onClick={() => goToURL(href)}
    >
      <div>
        <p className="mt0">
          To link your packages, you need to authorize npm to access the GitHub repositories that contain those
          packages.
        </p>
        <p className="mb0">
          When you click Continue, you&apos;ll be taken to GitHub to authorize the repositories and organizations that
          contain packages that you want to link. Once you&apos;ve done that, we&apos;ll find the npm packages to link.
        </p>
      </div>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  href: PropTypes.string.isRequired,
  dialogIsOpen: PropTypes.bool.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
}

function HomepageInitiateMFABanner({setupTfaOnAccountLink}) {
  const tfaBannerMessage = (
    <span className={bannerStyles.bannerTextYellow}>
      You don’t have two-factor authentication (2FA) enabled on your account.{' '}
      <a className={bannerStyles.bannerLinkYellow} href={setupTfaOnAccountLink}>
        Configure 2FA
      </a>{' '}
      or{' '}
      <a className={bannerStyles.bannerLinkYellow} href="https://docs.npmjs.com/configuring-two-factor-authentication">
        visit our docs
      </a>{' '}
      to learn more.
    </span>
  )
  return <Banner backgroundColor="yellow" text={tfaBannerMessage} />
}

HomepageInitiateMFABanner.propTypes = {
  setupTfaOnAccountLink: PropTypes.string.isRequired,
}
function HomepageInitiateAutolinkingBanner({ghAppInstallHref}) {
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  return [
    <CallToAction
      text="Link your GitHub repositories to your npm packages so that people can discover them more easily."
      buttonCaption="Get Started"
      iconName="githubIcon"
      key="get-started"
      onClick={() => setDialogIsOpen(true)}
    />,
    <ConfirmDialog
      key="confirm-dialog"
      href={ghAppInstallHref}
      dialogIsOpen={dialogIsOpen}
      setDialogIsOpen={setDialogIsOpen}
    />,
  ]
}

HomepageInitiateAutolinkingBanner.propTypes = {
  ghAppInstallHref: PropTypes.string.isRequired,
}

function PackagePageInitiateAutolinkingBanner({ghAppInstallHref}) {
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  return (
    <React.Fragment>
      <CallToAction
        text="Link your GitHub repository to your npm package so that people can discover it more easily."
        buttonCaption="Get Started"
        iconName="githubIcon"
        onClick={() => setDialogIsOpen(true)}
      />
      <ConfirmDialog href={ghAppInstallHref} dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen} />
    </React.Fragment>
  )
}

PackagePageInitiateAutolinkingBanner.propTypes = {
  ghAppInstallHref: PropTypes.string.isRequired,
}
