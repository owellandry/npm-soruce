'use strict'
const React = require('react')
const {Helmet} = require('react-helmet')
require('tachyons/css/tachyons.min.css')

class Head extends React.PureComponent {
  render() {
    return (
      <Helmet>
        <title>npm</title>

        <meta httpEquiv="cleartype" content="on" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes" />

        <link
          href={`${process.env.STATIC_URL}osd.xml`}
          rel="search"
          title="npm package search"
          type="application/opensearchdescription+xml"
        />

        <link rel="apple-touch-icon" sizes="120x120" href={require('./images/apple-touch-icon-120x120.png')} />
        <link rel="apple-touch-icon" sizes="144x144" href={require('./images/apple-touch-icon-144x144.png')} />
        <link rel="apple-touch-icon" sizes="152x152" href={require('./images/apple-touch-icon-152x152.png')} />
        <link rel="apple-touch-icon" sizes="180x180" href={require('./images/apple-touch-icon-180x180.png')} />

        <link rel="icon" type="image/png" href={require('./images/favicon-32x32.png')} sizes="32x32" />
        <link rel="icon" type="image/png" href={require('./images/favicon-230x230.png')} sizes="230x230" />
        <link rel="icon" type="image/png" href={require('./images/favicon-96x96.png')} sizes="96x96" />
        <link rel="icon" type="image/png" href={require('./images/android-chrome-192x192.png')} sizes="192x192" />
        <link rel="icon" type="image/png" href={require('./images/coast-228x228.png')} sizes="228x228" />
        <link rel="icon" type="image/png" href={require('./images/favicon-16x16.png')} sizes="16x16" />

        <meta property="og:image" content={require('./images/open-graph.png')} />

        <meta name="msapplication-TileColor" content="#cb3837" />
        <meta name="msapplication-TileImage" content={require('./images/mstile-144x144.png')} />
        <meta name="msapplication-config" content={require('./images/browserconfig.xml')} />

        <meta name="theme-color" content="#cb3837" />
      </Helmet>
    )
  }
}

module.exports = Head
