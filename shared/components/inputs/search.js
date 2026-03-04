'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const connect = require('../../components/connect')
const SemiControlledInput = require('./semi-controlled')
const styles = require('../header/header.css')
const formIdConsumer = require('./form-id-consumer')
const omit = require('lodash/omit')
const SearchIcon = require('../icons/search')

class SearchInput extends React.PureComponent {
  constructor(props) {
    super(props)

    this.doc = null
    this.isFocused = false

    this.inputField = React.createRef()
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.doBlur = this.doBlur.bind(this)
    this.doFocus = this.doFocus.bind(this)
    this.keydownHandler = this.keydownHandler.bind(this)
    this.clearInput = this.clearInput.bind(this)
  }

  handleFocus(e) {
    this.isFocused = true
    this.props.onFocus && this.props.onFocus(e)
  }

  handleBlur(e) {
    this.isFocused = false
    this.props.onBlur && this.props.onBlur(e)
  }

  onChange(ev) {
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: ev.target.value,
    })
    this.props.onChange(ev)
  }

  clearInput(ev) {
    ev.preventDefault()
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: '',
    })

    this.props.onChange({target: {value: ''}})

    setTimeout(() => {
      if (this.inputField.current) {
        this.inputField.current.focus()
      }
    }, 100)
  }

  componentDidMount() {
    if (this.props.hotkeys) {
      this.doc = this.props.document || document
      this.doc.addEventListener('keydown', this.keydownHandler)
    }
  }

  componentWillUnmount() {
    if (this.props.hotkeys) {
      this.doc.removeEventListener('keydown', this.keydownHandler)
    }
  }

  doBlur(ev) {
    if (!this.isFocused) return
    ev.preventDefault()
    this.inputField.current.blur(ev)
  }

  doFocus(ev) {
    if (this.isFocused) return
    if (this.doc.activeElement.tagName !== 'BODY') return
    ev.preventDefault()
    this.inputField.current.focus()
  }

  keydownHandler(ev) {
    const blurKey = this.props.hotkeys.blur || 'Escape'
    const focusKey = this.props.hotkeys.focus

    const mappings = {
      [blurKey]: e => this.doBlur(e),
      [focusKey]: e => this.doFocus(e),
    }
    const fn = mappings[ev.key] || (() => {})

    fn(ev)
  }

  render() {
    const {formData, containerClass, inputClass, name} = this.props
    const {value = ''} = formData
    const hasValue = value && value.length > 0

    return (
      <div className={containerClass || styles.searchContainer}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <SemiControlledInput
          {...omit(this.props, ['inputClass', 'containerClass', 'formData', 'dispatch', 'formId', 'autoFocus'])}
          type="search"
          name="q"
          inputref={this.inputField}
          autoComplete="off"
          className={inputClass || styles.searchInput}
          value={value}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={ev => this.onChange(ev)}
        />
        {hasValue && (
          <button
            type="button"
            className={styles.searchClearButton}
            onClick={this.clearInput}
            aria-label="Clear search"
            tabIndex={0}
          >
            ×
          </button>
        )}
      </div>
    )
  }
}

SearchInput.propTypes = {
  // passing in document using dependency injection
  // to make global event handlers more testable
  document: PropTypes.object,
  formId: PropTypes.string.isRequired,
  name: PropTypes.string,
  formData: types.formDatum,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
}

SearchInput.defaultProps = {
  name: 'q',
  onChange: () => {},
  onBlur: () => {},
}

module.exports = connect()(formIdConsumer(SearchInput))
