const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const connect = require('../connect')
const DialogForServiceCode = require('./dialog-for-service-code')
const {LinkingButton} = require('./elements')

class PackageLinkingButton extends React.Component {
  constructor(props) {
    super(props)
    this.doAuthAction = this.doAuthAction.bind(this)
    this.dismissDialog = this.dismissDialog.bind(this)
    this.onDialogDismiss = this.onDialogDismiss.bind(this)
    this.linkPackage = this.linkPackage.bind(this)
  }

  componentDidMount() {
    const {pkgToLink, package: pkg} = this.props
    if (pkgToLink === pkg.name) {
      this.linkPackage()
    }
  }

  dismissDialog() {
    const {
      dispatch,
      package: {name},
    } = this.props

    dispatch({type: 'SET_PACKAGE_LINK_STATUS', name, status: undefined})
  }

  doAuthAction() {
    const {authUrl} = this.props
    this.dismissDialog()
    if (authUrl) {
      window.location = authUrl
    }
  }

  onDialogDismiss() {
    const {
      dispatch,
      scope,
      package: {name},
    } = this.props
    this.dismissDialog()
    dispatch('DELETE_PENDING_PACKAGE_LINK', {scope, name})
  }

  linkPackage() {
    const {
      dispatch,
      scope,
      package: {name},
    } = this.props
    dispatch('LINK_PACKAGE', {scope, name})
  }

  render() {
    const {pending, linkingServiceCode, className} = this.props
    return (
      <React.Fragment>
        {linkingServiceCode && (
          <DialogForServiceCode onDismiss={this.onDialogDismiss} onClick={this.doAuthAction} {...this.props} />
        )}
        <LinkingButton className={className} linkPackage={this.linkPackage} pending={pending} />
      </React.Fragment>
    )
  }
}

PackageLinkingButton.propTypes = {
  package: types.packageListItem,
  scope: PropTypes.string.isRequired,
}

const defaultStatus = {
  pending: undefined,
  linkingServiceCode: undefined,
  ownerId: undefined,
  ownerName: undefined,
  repositoryPath: undefined,
  repositoryURL: undefined,
  authUrl: undefined,
}

/**
 * Maps props to PackageLinkingButton based on store state
 * @param {Object} state - Store state
 * @param {Object} props - Wrapper props
 */
const linkingPropsMapper = ({props: {linkingStatus, pkgToLink}}, {package: {name}}) => ({
  ...defaultStatus,
  ...(linkingStatus && linkingStatus[name]),
  pkgToLink,
})

module.exports = connect(linkingPropsMapper)(PackageLinkingButton)
