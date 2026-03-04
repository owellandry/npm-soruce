'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./headed-section.css')

class HeadedSection extends React.PureComponent {
  render() {
    return (
      <section className={styles.container}>
        <h2 className={styles.header}>{this.props.title}</h2>
        <div className={styles.body}>{this.props.children}</div>
      </section>
    )
  }
}

HeadedSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

module.exports = HeadedSection
