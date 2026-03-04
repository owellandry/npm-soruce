const React = require('react')
const connect = require('../connect')
const formIdConsumer = require('./form-id-consumer')
const PropTypes = require('prop-types')
const {default: Select, components} = require('react-select')
const types = require('../../types')
const styles = require('../../styles/forms.css')

const CustomOption = props => {
  /** @type {React.RefObject<HTMLDivElement>} */
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (props.isFocused && ref.current) {
      const menuList = ref.current.closest('.react-select__menu-list')

      if (menuList) {
        const optionTop = ref.current.offsetTop
        const optionHeight = ref.current.offsetHeight
        const menuScrollTop = menuList.scrollTop
        const menuHeight = menuList.clientHeight

        const optionBottom = optionTop + optionHeight
        const visibleTop = menuScrollTop
        const visibleBottom = menuScrollTop + menuHeight

        // Check if option is outside visible area
        const needsScroll = optionTop < visibleTop || optionBottom > visibleBottom

        if (needsScroll) {
          // Use scrollIntoView with smooth behavior for better UX
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          })
        }
      } else {
        // Fallback if menuList not found
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }
  }, [props.isFocused])

  return (
    <div ref={ref}>
      <components.Option {...props} />
    </div>
  )
}

class SelectInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.returnFocusToSelect = this.returnFocusToSelect.bind(this)
    this.getCurrentSelectRef = this.getCurrentSelectRef.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.selectContainerRef = React.createRef()

    this.hasFocused = false
    this.state = {
      isMobile: typeof window !== 'undefined' && window.innerWidth <= 768,
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize)
    }

    if (this.props.value) {
      return
    }

    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: this.getSelectedValue(),
    })
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize)
    }
  }

  handleResize() {
    if (typeof window === 'undefined') {
      return
    }
    const isMobile = window.innerWidth <= 768
    if (this.state.isMobile !== isMobile) {
      this.setState({isMobile})
    }
  }

  onChange(selectedOption) {
    const {name, formId} = this.props
    const value = selectedOption ? selectedOption?.value : ''
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value,
    })
    this.props.onChange && this.props.onChange(selectedOption)

    setTimeout(() => {
      this.returnFocusToSelect()
    }, 100)
  }

  onFocus() {
    if (this.selectContainerRef && this.selectContainerRef.current) {
      const container = this.selectContainerRef.current

      const menu = container.querySelector('.react-select__menu')
      if (menu) {
        return
      }

      if (this.hasFocused) {
        return
      }

      this.hasFocused = true

      const rect = container.getBoundingClientRect()
      const isFullyVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

      if (!isFullyVisible) {
        setTimeout(() => {
          if (container && document.contains(container)) {
            container.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            })
          }
        }, 50)
      }
    }
  }

  onBlur() {
    this.hasFocused = false
  }

  returnFocusToSelect() {
    if (this.selectContainerRef && this.selectContainerRef.current) {
      const container = this.selectContainerRef.current

      const input = container.querySelector('input[role="combobox"]')
      if (input && document.contains(input)) {
        try {
          container.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          })

          setTimeout(() => {
            if (input && document.contains(input)) {
              input.focus()
            }
          }, 150)
        } catch (error) {
          console.warn('SelectInput: Could not return focus to select:', error)
        }
      }
    }
  }

  getCurrentSelectRef() {
    if (this.selectContainerRef && this.selectContainerRef.current) {
      const container = this.selectContainerRef.current

      const input = container.querySelector('.react-select__input input, input[role="combobox"]')
      if (input) return input

      const control = container.querySelector('.react-select__control')
      if (control) {
        if (!control.hasAttribute('tabindex') && !control.querySelector('input')) {
          control.setAttribute('tabindex', '-1')
        }
        return control
      }
    }

    if (this.props.inputref) {
      const selectComponent = typeof this.props.inputref === 'function' ? null : this.props.inputref.current

      if (selectComponent) {
        if (selectComponent.controlRef) {
          return selectComponent.controlRef
        }

        if (selectComponent.select && selectComponent.select.controlRef) {
          return selectComponent.select.controlRef
        }

        if (selectComponent.inputRef) {
          return selectComponent.inputRef
        }

        try {
          const wrapper = selectComponent.select || selectComponent
          if (wrapper && wrapper.inputRef && wrapper.inputRef.parentElement) {
            let current = wrapper.inputRef.parentElement
            while (current && !current.classList.contains('react-select__control')) {
              current = current.parentElement
              if (!current || current === document.body) break
            }
            if (current && current.classList.contains('react-select__control')) {
              if (this.selectContainerRef.current && this.selectContainerRef.current.contains(current)) {
                if (!current.hasAttribute('tabindex')) {
                  current.setAttribute('tabindex', '-1')
                }
                return current
              }
            }
          }
        } catch (e) {}
      }
    }

    return null
  }

  getSelectedValue() {
    const {value: defaultValue, formData = {}, values} = this.props
    const value = formData.value || defaultValue
    return values.find(option => option.value === value) || ''
  }

  render() {
    const {name, values, label, className, formId, isMandatory, isSearchable, inputref} = this.props
    const id = `${formId}_${name}`
    const selectedValue = this.getSelectedValue()

    const getScreenReaderLabel = option => {
      if (!option) return ''
      if (option.textLabel) return option.textLabel
      if (typeof option.label === 'string') return option.label
      return option.value || ''
    }

    return (
      <div className={styles.selectContainer} ref={this.selectContainerRef}>
        <label className={styles.label} htmlFor={id} id={`${id}-label`}>
          {label}
          {isMandatory && <abbr>*</abbr>}
        </label>
        <Select
          ref={inputref}
          id={id}
          name={name}
          className={`${styles.selectElement} ${className}`}
          value={selectedValue}
          options={values}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          menuPlacement="auto"
          menuPosition="fixed"
          maxMenuHeight={this.state.isMobile ? 100 : 300}
          menuShouldScrollIntoView={false}
          menuShouldBlockScroll={false}
          components={{Option: CustomOption}}
          aria-labelledby={`${id}-label`}
          isClearable={false}
          isSearchable={isSearchable}
          noOptionsMessage={() => this.props.noOptionsMessage || '0 options available'}
          styles={{
            control: (provided, state) => ({
              ...provided,
              outline: state.isFocused ? '2px solid #0969da' : provided.outline,
              outlineOffset: state.isFocused ? '1px' : provided.outlineOffset,
              borderColor: state.isFocused ? '#0969da' : provided.borderColor,
              boxShadow: state.isFocused ? '0 0 0 1px #0969da' : provided.boxShadow,
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#0969da' : state.isFocused ? '#f6f8fa' : provided.backgroundColor,
              color: state.isSelected ? '#ffffff' : provided.color,
              border: state.isSelected ? '1px solid' : provided.border,
              borderColor:
                state.isSelected && state.isFocused
                  ? '#ffffff'
                  : state.isFocused || state.isSelected
                    ? '#0969da'
                    : provided.borderColor,
              outline: state.isFocused ? '2px solid' : provided.outline,
              outlineColor: state.isSelected && state.isFocused ? '#ffffff' : '#0969da',
              outlineOffset: '-2px',
              padding: '8px 12px',
              boxSizing: 'border-box',
            }),
          }}
          ariaLiveMessages={{
            guidance: () => '',
            onChange: selection => {
              if (!selection) return 'Selection cleared'

              let actualOption = null
              if (selection.value) {
                actualOption = selection.value
              } else if (selection.options && selection.options.length > 0) {
                actualOption = selection.options[0]
              } else {
                actualOption = selection
              }

              const label = getScreenReaderLabel(actualOption)
              return label ? `${label} selected` : 'Selection made'
            },
            onFilter: resultCount => {
              let count
              if (typeof resultCount === 'object' && resultCount.resultsMessage) {
                const match = resultCount.resultsMessage.match(/(\d+)/)
                count = match ? parseInt(match[1], 10) : 0
              } else if (typeof resultCount === 'number') {
                count = resultCount
              } else {
                count = 0
              }

              return `${count} option${count === 1 ? '' : 's'} available`
            },
            onFocus: () => {
              return ''
            },
          }}
        />
      </div>
    )
  }
}

SelectInput.propTypes = {
  formId: PropTypes.string,
  value: PropTypes.string,
  formData: types.formDatum,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      textLabel: PropTypes.string, // For clean screen reader text when label is JSX
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  isMandatory: PropTypes.bool,
  isSearchable: PropTypes.bool,
  inputref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.any})]),
  noOptionsMessage: PropTypes.string,
}

SelectInput.defaultProps = {
  isSearchable: true,
  className: '',
  isMandatory: false,
}

module.exports = connect()(formIdConsumer(SelectInput))
