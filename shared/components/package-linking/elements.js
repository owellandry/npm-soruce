'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./elements.css')
const Spinner = require('../spinner/spinner')
const GitHubIcon = require('../icons/github')
const forms = require('../../styles/forms.css')

module.exports = {
  LinkingDetail,
  LinkingButton,
  GeneralLinkingButton,
}

const gitHubIconSize = 20

function LinkingDetail({link}) {
  return (
    <a
      className="black-50 ml3 flex items-center justify-end-l truncate"
      href={`https://github.com/${link}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <div className={styles.mr6px}>
        <GitHubIcon size={gitHubIconSize} verticalAlign="middle" />
      </div>
      <div className={styles.pkgName}>{link}</div>
    </a>
  )
}

LinkingDetail.propTypes = {
  link: PropTypes.string.isRequired,
}

function LinkingButton({linkPackage, pending, className}) {
  return (
    <GeneralLinkingButton
      as="button"
      className={`flex items-center ${className}`}
      disabled={pending}
      onClick={linkPackage}
      title={pending && 'Linking cannot be performed at this time. Please wait.'}
    >
      <RotatiCat isLinking={pending} />
      Link your package
    </GeneralLinkingButton>
  )
}

LinkingButton.propTypes = {
  linkPackage: PropTypes.func,
  pending: PropTypes.bool,
}

function GeneralLinkingButton({className = '', as = 'a', ...rest}) {
  const Component = as
  return <Component className={`${forms.buttonGradient} ${styles.linkButton} ${className}`} {...rest} />
}

function RotatiCat({isLinking}) {
  return <div className={styles.mr6px}>{isLinking ? <Spinner /> : <GitHubIcon size={gitHubIconSize} />}</div>
}

RotatiCat.propTypes = {
  isLinking: PropTypes.bool,
}
