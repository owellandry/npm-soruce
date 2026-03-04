'use strict'

const React = require('react')
const styles = require('../styles/beta.css')

const {Label} = require('@primer/react')

function Beta(props) {
  return (
    <span className={styles.betaLabel}>
      <Label variant="medium" sx={{fontWeight: 600}} outline dropshadow {...props}>
        Beta
      </Label>
    </span>
  )
}

module.exports = Beta
