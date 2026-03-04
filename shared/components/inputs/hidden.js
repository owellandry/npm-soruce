const React = require('react')
const PropTypes = require('prop-types')
const types = require('../../types')
const formIdConsumer = require('./form-id-consumer')
const connect = require('../connect')

class HiddenInput extends React.PureComponent {
  componentDidMount() {
    const {name, formId} = this.props
    this.props.dispatch({
      type: 'FORM_CHANGE',
      name,
      formId,
      value: this.refs.input.value,
    })
  }

  componentWillUpdate(newProps) {
    const {name, formId} = this.props
    if (newProps.value && newProps.formData.value !== newProps.value) {
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name,
        formId,
        value: newProps.value,
      })
    }
  }

  render() {
    const {name, value: defaultValue, formData = {}} = this.props
    const {value = defaultValue} = formData
    return <input ref="input" type="hidden" name={name} value={value} />
  }
}

HiddenInput.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  formData: types.formDatum,
}

module.exports = connect()(formIdConsumer(HiddenInput))
