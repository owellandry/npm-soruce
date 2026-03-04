const React = require('react')
const {Helmet} = require('react-helmet')
const styles = require('./pane-homepage-content.css')
const Button = require('../button/button')

module.exports = () => {
  return (
    <article className={`bg-white dark-gray ${styles.npmContent}`}>
      <section className={`${styles.npmBg} ${styles.npmBgHero}`}>
        <Helmet>
          <title>npm | Home</title>
        </Helmet>
        <div className="center mw7 pv5 ph3 tc white">
          <h1 className={`f-subheadline-m f-subheadline-l f1 lh-title ${styles.tagline}`}>Build amazing things</h1>

          <div className="center mw6 lh-copy">
            <div>
              We&apos;re GitHub, the company behind the npm Registry and npm CLI. We offer those to the community for
              free, but our day job is building and selling useful tools for developers like you.
            </div>

            <h2 className="f2-l f3 lh-title">Take your JavaScript development up a notch</h2>

            <div>
              Get started today for free, or step up to npm Pro to enjoy a premium JavaScript development experience,
              with features like private packages.
            </div>

            <div className="mt5 flex flex-wrap">
              <div className="w-100 w-50-ns pr3-ns pb3">
                <Button href="/signup" type="darkBgPrimary">
                  Sign up for free
                </Button>
              </div>

              <div className="w-100 w-50-ns pl3-ns pb3">
                <Button href="/products/pro" type="darkBgSecondary">
                  Learn about Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pv5 ph3 bg-white">
        <div className="center mw6 mb5 tc lh-copy">
          <img
            alt=""
            role="presentation"
            src="https://static-production.npmjs.com/attachments/ck3uweazy72ye8874y9kkxnx1-gak.png"
            srcSet="https://static-production.npmjs.com/attachments/ck3uweazy72ye8874y9kkxnx1-gak.png,
                https://static-production.npmjs.com/attachments/ck3uwed1cmso79y74pjugy10f-gak-2x.png 2x,
                https://static-production.npmjs.com/attachments/ck3uweeyt72yk887420va22p9-gak-3x.png 3x"
            className="db center mb4"
          />

          <h2 className="f2-l f3 lh-title">Bring the best of open source to you, your team, and your company</h2>

          <div>
            Relied upon by more than 17 million developers worldwide, npm is committed to making JavaScript development
            elegant, productive, and safe. The free npm Registry has become the center of JavaScript code sharing, and
            with more than two million packages, the largest software registry in the world. Our other tools and
            services take the Registry, and the work you do around it, to the next level.
          </div>
        </div>
      </section>
      <link
        href="https://fonts.googleapis.com/css?family=Arimo|Poppins:400,600,700&amp;display=swap"
        rel="stylesheet"
      />
    </article>
  )
}
