const React = require('react')
const Dialog = require('../../components/dialog/dialog')
const Link = require('@npm/spiferack/link')
const styles = require('./dialog-for-service-code.css')

const DIALOGS = {
  AUTH_USER: AuthUserDialog,
  NEEDS_ACCESS: NeedsAccessDialog,
  NO_APP_INSTALLED: NoAppInstalledDialog,
  NO_USER_OWNER_ACCESS: NoUserOwnerAccessDialog,
  NOT_GITHUB: NotGitHubDialog,
  NOT_PUBLIC: NotPublicDialog,
  NOT_PUBLIC_OR_NON_EXISTENT: NotPublicOrNonExistent,
  NON_EXISTENT: NonExistentDialog,
  NOT_THE_SAME_REPO: NotTheSameRepoDialog,
}

/** @typedef {import('../../../types/package-linking').PackageLinkingResult} PackageLinkingResult */

module.exports = function DialogForServiceCode(props) {
  /** @type {PackageLinkingResult['status']} */
  const linkingServiceCode = props.linkingServiceCode

  const LinkingDialog = DIALOGS[linkingServiceCode] || MiscellaneousErrorDialog
  return <LinkingDialog {...dialogProps(props)} />
}

function dialogProps(props) {
  const {authUrl, linkingServiceCode} = props
  return {
    ...props,
    cancelText: authUrl ? 'Close' : undefined,
    doActionText: authUrl ? 'Continue' : undefined,
    headerText: 'Problem linking this package',
    ariaLabelledBy: 'Problem linking this package',
    isOpen: linkingServiceCode != null,
  }
}

function NoAppInstalledDialog(props) {
  const ownerId = props.ownerId
  const ownerName = props.ownerName
  const repositoryPath = props.repositoryPath
  const repositoryURL = `https://github.com/${repositoryPath}`

  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p>
            The repository you are attempting to link,
            <Link>
              <a
                className={['link', styles.emphasis].join(' ')}
                href={repositoryURL}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {` ${repositoryPath}`}
              </a>
            </Link>
            , does not have the appropriate permissions setup.
          </p>
          <p>
            <b>To link this package:</b>
          </p>
          <ul className={styles.stepsToCorrect}>
            {/* Only show name when `ownerId` is not available, i.e. we don't deep link */}
            {ownerId ? (
              <li>Click continue to install the “npm repository linking” app</li>
            ) : (
              <li>
                Click continue to install the “npm repository linking” app on <b>{ownerName}</b>
              </li>
            )}
          </ul>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NotGitHubDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            We can only link public GitHub repositories. Please update your <code>package.repository</code> field to
            point to a valid public GitHub repository if you want to link this package.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function MiscellaneousErrorDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">We were not able to link your package at this time.</p>
          <p>
            If you feel this was in error,{' '}
            <Link>
              <a className={['link', styles.emphasis].join(' ')} href="/support">
                please let us know.
              </a>
            </Link>{' '}
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function AuthUserDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            Almost there! Please click continue to verify that you have the appropriate permissions to finish the
            linking process for this package.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NeedsAccessDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            Sorry but you do not have the appropriate permissions on GitHub to link this repository and package. Please
            reach out to the Repository maintainers to set up linking or give you the appropriate permissions.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NoUserOwnerAccessDialog(props) {
  const username = props.ownerName
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            Sorry but the user <b>{username}</b> needs to install the app “npm repository linking” before it is possible
            to link this package to any of their repos.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NotPublicDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">Private Repositories are not currently supported.</p>
          <p>
            <b>To link this package:</b>
          </p>
          <ul className={styles.stepsToCorrect}>
            <li>
              <Link>
                <a
                  className={['link', styles.emphasis].join(' ')}
                  href="https://docs.github.com/en/github/administering-a-repository/setting-repository-visibility#changing-a-repositorys-visibility"
                >
                  Change your repository visibility to public
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NotPublicOrNonExistent(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            It appears that the repository referenced in your <code>package.repository</code> field does not exist. If
            the repository does exist but is private, you will need to make it public in order to link.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NonExistentDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            It appears that the repository referenced in your <code>package.repository</code> field does not exist.
            Please create the repository you want to link to.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function NotTheSameRepoDialog(props) {
  return (
    <Dialog {...props}>
      <React.Fragment>
        <div>
          <p className="mt0">
            It appears that the repository referenced in your <code>package.repository</code> field is not the same as
            your GitHub repository. Please fix it in your <code>package.json</code> file.
          </p>
        </div>
        <LearnMore />
      </React.Fragment>
    </Dialog>
  )
}

function LearnMore() {
  return (
    <div>
      <p>
        {'Questions? '}
        <Link>
          <a
            className={['link', styles.emphasis].join(' ')}
            href="https://docs.npmjs.com/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Learn about package linking.
          </a>
        </Link>
      </p>
    </div>
  )
}
