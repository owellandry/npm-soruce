'use strict'
const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const {filter} = require('fuzzaldrin')
const styles = require('./typeahead.css')
const Avatar = require('@npm/design-system/avatar/avatar')
const connect = require('../../components/connect')
const formIdConsumer = require('../inputs/form-id-consumer')
const uniqueId = require('lodash/uniqueId')
const globalStyle = require('../../styles/global.css')
const classNames = require('../../utils/class-names')

class TypeAheadInput extends React.PureComponent {
  constructor(...args) {
    super(...args)
    this.state = {
      matches: [],
      loading: false,
      selectedIndex: -1,
      liveMessage: '',
    }
    this.matchesListRef = React.createRef()
    this.id = uniqueId()
    this.liveRegionTimeout = null
  }

  updateLiveRegion(message) {
    this.setState({liveMessage: ''})
    if (this.liveRegionTimeout !== null) {
      clearTimeout(this.liveRegionTimeout)
    }
    this.liveRegionTimeout = setTimeout(() => {
      this.setState({liveMessage: message})
    }, 100) // Adjust delay if needed
  }

  async onChange(ev) {
    const {value} = ev.target
    const {objects, getSuggestions} = this.props
    if (!value) return this.closeList()

    this.setState({loading: true})

    if (Array.isArray(objects)) {
      const matches = filter(objects, value, {key: 'name'})
      this.updateSuggestions(matches)
    } else if (objects) {
      // It's an async generator
      if (!this.listPromise) {
        this.listPromise = Promise.all([...objects])
      }
      const asyncObjects = await this.listPromise
      const matches = filter(asyncObjects, value, {key: 'name'})
      this.updateSuggestions(matches)
    } else if (getSuggestions) {
      const matches = await getSuggestions(value)
      this.updateSuggestions(matches)
    }
  }

  updateSuggestions(matches) {
    this.setState({matches, loading: false}, () => {
      this.updateLiveRegion(`${matches.length} suggestions available.`)
    })
  }

  onBlur(ev) {
    if (ev.currentTarget.contains(ev.relatedTarget)) return
    this.closeList()
  }

  onKeyUp(ev) {
    const {selectedIndex, matches} = this.state
    const match = matches[selectedIndex]

    const actions = {
      Enter: () => {
        if (match) {
          this.onSelect(match.name)
          ev.preventDefault()
        }
        this.closeList()
      },
      Escape: () => this.closeList(),
    }

    const action = actions[ev.key] || (() => {})
    action()
  }

  onKeyDown(ev) {
    const {selectedIndex, matches} = this.state
    const {length} = matches

    const actions = {
      ArrowDown: () => {
        if (length) {
          ev.preventDefault()
          const newIndex = (selectedIndex + 1) % length
          this.setState({selectedIndex: newIndex})
          this.focusItem(newIndex)
        }
      },
      ArrowUp: () => {
        if (length) {
          ev.preventDefault()
          const newIndex = Math.max(selectedIndex - 1, 0)
          this.setState({selectedIndex: newIndex})
          this.focusItem(newIndex)
        }
      },
    }

    const action = actions[ev.key] || (() => {})
    action()
  }

  focusItem(index) {
    const item = this.matchesListRef.current.children[index]
    if (item) {
      item.focus()
      this.props.onChangeActiveElement(item.id)
    }
  }

  closeList() {
    this.setState({matches: [], selectedIndex: -1, loading: false, liveMessage: ''})
  }

  onSelect(name) {
    const {onSelect} = this.props
    this.closeList()
    this.updateFormData(name)
    onSelect(name)
  }

  updateFormData(value) {
    const {dispatch, formId} = this.props
    if (formId) {
      dispatch({
        type: 'FORM_CHANGE',
        formId,
        name: this.inputName,
        value,
      })
    }
  }

  render() {
    const {inputElem, formId, name, formData: propsFormData, renderRow, renderHeader, title} = this.props
    const {matches, loading, selectedIndex, liveMessage} = this.state
    const formData = {
      [formId]: {
        [name]: matches[selectedIndex] ? {value: matches[selectedIndex].name} : propsFormData,
      },
    }

    this.inputName = inputElem.props.name
    const hasMatches = matches.length > 0
    const listId = `typeahead-list-${this.id}`

    return (
      <div className={`${styles.typeahead} ${this.props.className}`} onBlur={ev => this.onBlur(ev)}>
        {hasMatches && (
          <button className={`${styles.backdrop} ${globalStyle.clean}`} onClick={() => this.closeList()} />
        )}
        {React.cloneElement(inputElem, {
          formData,
          onKeyUp: ev => this.onKeyUp(ev),
          onKeyDown: ev => this.onKeyDown(ev),
          onChange: ev => this.onChange(ev),
          'aria-label': this.props['aria-label'] || null,
          'aria-controls': listId,
          'aria-expanded': hasMatches || loading,
          'aria-activedescendant': selectedIndex > -1 ? `${listId}-${selectedIndex}` : '',
          role: 'combobox',
        })}

        <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
          {liveMessage}
        </div>

        {loading && (
          <MatchesList
            matches={[{name: '…'}]}
            containerClassName={this.props.childClassNames?.container}
            listClassName={this.props.childClassNames?.list}
          />
        )}
        {hasMatches && (
          <MatchesList
            matches={matches}
            onSelect={name => this.onSelect(name)}
            selectedIndex={selectedIndex}
            renderRow={renderRow}
            renderHeader={renderHeader}
            title={title || ''}
            reference={this.matchesListRef}
            onKeyUp={this.onKeyUp.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            id={listId}
            containerClassName={this.props.childClassNames?.container}
            listClassName={this.props.childClassNames?.list}
          />
        )}
      </div>
    )
  }
}

function MatchesList(props) {
  const {
    matches,
    onSelect,
    selectedIndex,
    renderRow = TypeAheadInput.defaultProps.renderRow,
    renderHeader = TypeAheadInput.defaultProps.renderHeader,
    title,
    reference,
    onKeyUp,
    onKeyDown,
    id = `typeahead-list-${uniqueId()}`,
    containerClassName,
    listClassName,
  } = props
  return (
    <div className={classNames(styles.typeaheadListContainer, containerClassName)}>
      {renderHeader()}
      <ul
        aria-label={title}
        className={classNames(styles.typeaheadList, listClassName)}
        ref={reference}
        role="listbox"
        id={id}
      >
        {matches.map((object, index) => {
          const {name, description, version} = object
          const highlightClass = selectedIndex === index ? styles.highlight : ''

          let ariaLabel = name
          if (description || version) {
            const parts = [name]
            if (version) parts.push(`version ${version}`)
            if (description) parts.push(description)
            ariaLabel = parts.join(', ')
          }

          return (
            <li
              key={name}
              className={`${styles.typeaheadListItem} ${highlightClass}`}
              onClick={() => onSelect(name)}
              aria-label={ariaLabel}
              tabIndex={-1}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              role="option"
              aria-selected={selectedIndex === index}
              id={`${id}-${selectedIndex}`}
            >
              {renderRow(object, index)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

TypeAheadInput.propTypes = {
  inputElem: PropTypes.element.isRequired,
  objects: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        resource: PropTypes.shape({
          fullname: PropTypes.string,
        }),
        avatars: PropTypes.object,
      }),
    ),
    PropTypes.shape({
      next: PropTypes.func.isRequired,
    }),
  ]),
  getSuggestions: PropTypes.func,
  onSelect: PropTypes.func,
  onChangeActiveElement: PropTypes.func,
  renderRow: PropTypes.func,
  renderHeader: PropTypes.func,
  formData: types.formDatum,
  className: PropTypes.string,
  childClassNames: PropTypes.object,
}

TypeAheadInput.defaultProps = {
  onSelect() {},
  renderRow(object) {
    const {name, avatars, resource = {}} = object
    return [
      avatars && <Avatar key="avatar" src={avatars.small || ''} size="tiny" />,
      <span key="name">{name}</span>,
      resource.fullname ? (
        <span key="fullname" className={styles.fullName}>
          {resource.fullname}
        </span>
      ) : null,
    ]
  },
  renderHeader() {
    return null
  },
  className: '',
}

module.exports = connect()(formIdConsumer(TypeAheadInput))
