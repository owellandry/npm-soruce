'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const Form = require('../forms/generic')
const SearchInput = require('../inputs/search')
const types = require('../../types')
const styles = require('./header.css')
const connect = require('../connect')
const searchSuggest = require('../../../client/actions/search-suggest')
const Typeahead = require('../typeahead/typeahead')
const go = require('../../../client/actions/go')
const ButtonSubmit = require('../forms/submit-button')
const {DownloadIcon} = require('@primer/octicons-react')
const {Stack} = require('../stack')

class SearchBar extends React.PureComponent {
  search(name) {
    this.props.dispatch(go(`/package/${name}`))
  }

  getSuggestions() {
    return this.props.dispatch(searchSuggest())
  }

  renderSuggestionV3(object, _index) {
    return (
      <Stack direction="horizontal">
        <Stack direction="vertical" align="baseline" gap={2}>
          <div>
            <strong>{object.name}</strong>
          </div>
          <div
            style={{
              color: 'var(--search-fg-muted)',
              fontSize: '0.875rem',
            }}
          >
            {object.version} • {object.description}
          </div>
        </Stack>
        <Stack direction="horizontal" width="auto" gap={1}>
          <DownloadIcon verticalAlign="middle" />
          <span>{object.downloads.monthly.toLocaleString()}</span>
        </Stack>
      </Stack>
    )
  }

  renderHeader() {
    return (
      <div
        style={{
          color: 'var(--search-fg-muted)',
          padding: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        Top results
      </div>
    )
  }

  renderSuggestion(object, index) {
    const {name, description, version} = object

    return index >= 5 ? (
      name
    ) : (
      <div className={styles.searchTypeahead}>
        <div>
          <strong>{name}</strong>
          <p>{description}</p>
        </div>
        <span className="fr db">{version}</span>
      </div>
    )
  }

  render() {
    const formId = 'search'
    const {formData = {[formId]: {}}} = this.props

    return (
      <div id="search" className={styles.search}>
        <Form
          className={styles.searchForm}
          action="/search"
          method="GET"
          formId={formId}
          formData={formData}
          showButton={false}
        >
          <Typeahead
            inputElem={
              <SearchInput name="q" hotkeys={{focus: '/'}} formData={formData} placeholder="Search packages" />
            }
            getSuggestions={() => this.getSuggestions()}
            renderHeader={this.props.isV3SearchEnabled ? this.renderHeader : () => {}}
            renderRow={this.props.isV3SearchEnabled ? this.renderSuggestionV3 : this.renderSuggestion}
            name="q"
            formData={formData}
            onSelect={name => this.search(name)}
            aria-label="Search packages"
            title="Search results"
            className={styles.typeahead}
            childClassNames={{
              container: this.props.isV3SearchEnabled && styles.typeaheadListContainer,
              list: this.props.isV3SearchEnabled && styles.typeaheadListList,
            }}
          />
          <ButtonSubmit className={styles.searchButton} buttonAriaLabel="Search">
            Search
          </ButtonSubmit>
        </Form>
      </div>
    )
  }
}

SearchBar.propTypes = {
  formData: types.formData,
  isV3SearchEnabled: PropTypes.bool,
}

const propsMapper = state => {
  return {isV3SearchEnabled: state.props.isV3SearchEnabled}
}
module.exports = connect(propsMapper)(SearchBar)
