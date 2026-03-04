'use strict'
const React = require('react')

// Drop in replacement for <input>s that buffers the value state, preventing
// an issue with controlled components that causes the cursor to jump to the
// end.
// Based on https://gist.github.com/rchanou/0a5c4173803a0d654f4c986d696a5c7f
class Input extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
      currentValue: props.value,
    }
  }

  handleChange(e) {
    this.setState({currentValue: e.target.value})
    this.props.onChange(e)
  }

  handleFocus(e) {
    this.setState({isFocused: true})
    this.props.onFocus(e)
  }

  handleBlur(e) {
    this.setState({isFocused: false})
    this.props.onBlur(e)
  }

  componentDidUpdate(prevProps) {
    // Update the current value when props.value changes and the input is not focused
    if (!this.state.isFocused && prevProps.value !== this.props.value) {
      this.setState({currentValue: this.props.value})
    }
  }

  render() {
    const props = Object.assign({}, this.props, {
      onChange: e => this.handleChange(e),
      onFocus: e => this.handleFocus(e),
      onBlur: e => this.handleBlur(e),
      value: this.state.currentValue,
    })
    const {trailingElement, ...inputProps} = props

    return trailingElement ? <InputWithTrailingElement {...props} /> : <SimpleInput {...inputProps} />
  }
}

function SimpleInput(props) {
  const {roleName, ...inputProps} = props
  return props.element === 'textarea' ? (
    <textarea ref={props.inputref} role={roleName} {...inputProps} />
  ) : (
    <input ref={props.inputref} role={roleName} {...inputProps} />
  )
}

function InputWithTrailingElement(props) {
  const {trailingElement, ...inputProps} = props
  return (
    <div style={{display: 'flex', position: 'relative', alignItems: 'center'}}>
      <SimpleInput {...inputProps} />
      {trailingElement}
    </div>
  )
}

Input.defaultProps = {
  element: 'input',
  onChange() {},
  onFocus() {},
  onBlur() {},
}

module.exports = Input
