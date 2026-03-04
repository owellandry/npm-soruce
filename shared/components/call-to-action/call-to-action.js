const React = require('react')
const PropTypes = require('prop-types')
const uuid = require('uuid/v4')

const FormButton = require('../../../design-system/button/form-button')
const GitHubIcon = require('../icons/github')
const styles = require('./call-to-action.css')

class CallToAction extends React.PureComponent {
  componentDidMount() {
    this.id = uuid()
  }

  render() {
    const {text, buttonCaption, iconName, onClick} = this.props

    return (
      <div className={styles.main}>
        <span id={this.id} className={styles.text}>
          {text}
        </span>
        <FormButton
          aria-describedby={this.id}
          className={styles.button}
          leftIcon={iconName === 'githubIcon' ? <GitHubIcon size={20} /> : null}
          onClick={onClick}
          ariaLabel={buttonCaption}
        >
          <span className={styles.linkText}>{buttonCaption}</span>
        </FormButton>
      </div>
    )
  }
}

CallToAction.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonCaption: PropTypes.string.isRequired,
  iconName: PropTypes.string,
}

module.exports = CallToAction
