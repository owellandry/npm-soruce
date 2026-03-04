'use strict'

const React = require('react')
const Head = require('./head/head')
const styles = require('../styles/global.css')
const LoadBar = require('./loadbar')
const Scroll = require('./scroll')
const DefaultLayout = require('./layouts/default')
const LiminalLayout = require('./layouts/liminal')
const LiminalLoginLayout = require('./layouts/liminal-login')
const LiminalWideLayout = require('./layouts/liminal-wide')
const LogoOnlyLayout = require('./layouts/logo-only')
const AdminLayout = require('./layouts/admin')
const SettingsLayout = require('./layouts/settings')
const NotificationContainer = require('./notifications/container')
const AlertBannerContainer = require('./alert-banner/container')
const ErrorBoundary = require('./error-boundary')
const Provider = require('./provider')
const PropTypes = require('prop-types')

const layouts = {
  admin: AdminLayout,
  liminal: LiminalLayout,
  'liminal-login': LiminalLoginLayout,
  'liminal-wide': LiminalWideLayout,
  logoOnly: LogoOnlyLayout,
  none: null,
  settings: SettingsLayout,
}

class Application extends React.PureComponent {
  render() {
    const {loading, notifications, alertBanners, store, csrftoken} = this.props
    return (
      <Provider store={store} csrftoken={csrftoken}>
        <div className={`${styles.global} ${styles.application}`}>
          <AlertBannerContainer banners={alertBanners || []} />
          <NotificationContainer notifications={notifications || []} />
          <Head />
          <Main {...this.props} />
          <LoadBar loading={loading} />
        </div>
        <Scroll />
      </Provider>
    )
  }
}

function Main(props) {
  const {children} = props
  const child = React.Children.only(children)
  const Layout = layouts[child.type.layout] || DefaultLayout
  const ChildComponent = <ErrorBoundary componentError={props.componentError}> {child} </ErrorBoundary>
  if (child.type.layout === 'none') {
    return ChildComponent
  } else {
    return <Layout {...props}>{ChildComponent}</Layout>
  }
}

Application.propTypes = {
  notifications: PropTypes.array,
  alertBanners: PropTypes.array,
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  csrftoken: PropTypes.string.isRequired,
}

module.exports = Application
