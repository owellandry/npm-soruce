'use strict'

module.exports = Pagination // , no breathing

const querystring = require('querystring')
const React = require('react')
const PropTypes = require('prop-types')

const Link = require('@npm/spiferack/link')
const styles = require('./pagination.css')

const Spacer = {}
const NavNext = {}
const NavPrev = {}

function Pagination({url, page, perPage, total, surround, className = ''}) {
  surround = Number(surround)
  perPage = Number(perPage)
  total = Number(total)
  page = Number(page)

  if (total <= perPage) {
    return null
  }

  const count = Math.ceil(total / perPage)
  page = Math.min(count - 1, page)

  // Start with an array of PAGE + up to SURROUND
  // items before and after page
  // (don't add SURROUND items if those pages don't exist)
  const start = Math.max(0, page - surround)
  const end = Math.min(count - 1, page + surround)
  const pages = Array.from(Array(end - start + 1)).map((_, idx) => {
    return idx + start
  })

  // If first item is not the first page
  if (pages[0] !== 0) {
    // ...and the first item is not the
    // second page, insert a spacer to
    // indicate we've hidden a few pages
    if (pages[0] !== 1) {
      pages.unshift(Spacer)
    }

    // ...then add the first page back
    // in so we always show it
    pages.unshift(0)

    // ...and add a "Previous" button
    pages.unshift(NavPrev)
  }

  // If the last item is not the last page
  if (pages[pages.length - 1] !== count - 1) {
    // ...and the last item is not the second
    // page, insert a spacer to indicate we've
    // hidden a few pages
    if (pages[pages.length - 1] !== count - 2) {
      pages.push(Spacer)
    }

    // ..then add the last page back in
    // so we always show it
    pages.push(count - 1)

    // ...and add a "Next" button
    pages.push(NavNext)
  }

  const elements = toElements(pages, page, count, perPage, url)

  return (
    <nav role="navigation" aria-label="Pagination Navigation" className={styles.pagination + ' ' + className}>
      {elements}
    </nav>
  )
}

Pagination.defaultProps = {
  page: 0,
  perPage: 10,
  surround: 3,
  url: '',
}

Pagination.propTypes = {
  total: PropTypes.any.isRequired,
}

function toElements(pages, page, count, perPage, url) {
  let spacers = 0
  const [base, existingSearch] = url.split('?')
  const existingQuery = querystring.parse(existingSearch)
  return pages.map(num => {
    // handle special elements:
    let search
    switch (num) {
      case Spacer:
        return (
          <div className={styles.page} key={`spacer-${spacers++}`}>
            {'…'}
          </div>
        )
      case NavPrev:
        search = querystring.stringify(Object.assign(existingQuery, {page: page - 1, perPage}))
        return (
          <div className={styles.page} key="nav-prev">
            <Link>
              <a aria-label="Previous page" href={`${base}?${search}`}>
                {'«'}
              </a>
            </Link>
          </div>
        )
      case NavNext:
        search = querystring.stringify(Object.assign(existingQuery, {page: page + 1, perPage}))
        return (
          <div className={styles.page} key="nav-next">
            <Link>
              <a aria-label="Next page" href={`${base}?${search}`}>
                {'»'}
              </a>
            </Link>
          </div>
        )
    }

    const human = num + 1
    const classNames = [styles.page]
    if (num === 0) {
      classNames.push(styles.first)
    } else if (num === count) {
      classNames.push(styles.last)
    }

    let ariaLabel = `Go to page ${human}`
    let ariaCurrent = false
    if (page === num) {
      classNames.push(styles.current)
      ariaLabel = `Current page, page ${human}`
      ariaCurrent = true
    }

    const href =
      `${base}?` +
      querystring.stringify(
        Object.assign(existingQuery, {
          page: num,
          perPage,
        }),
      )

    return (
      <div key={num} className={classNames.join(' ')}>
        <Link>
          <a aria-label={ariaLabel} href={href} aria-current={ariaCurrent}>
            {human}
          </a>
        </Link>
      </div>
    )
  })
}
