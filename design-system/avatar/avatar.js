const React = require('react')
const PropTypes = require('prop-types')
const styles = require('./avatar.css')
const Link = require('@npm/spiferack/link')
const wombatNoAvatar = require('./wombat-no-avatar.svg')

const divClasses = {
  normal: styles.avatar,
  small: styles.avatarSmall,
  tiny: styles.avatarTiny,
  micro: styles.avatarTiny,
  inline: styles.avatarInline,
}
const imgClasses = {
  normal: styles.image,
  small: styles.imageSmall,
  tiny: styles.imageTiny,
  micro: styles.imageMicro,
  minWidth: styles.avatarMinWidth,
  inline: styles.imageInline,
}

class Avatar extends React.PureComponent {
  render() {
    const {src, href, size, title, ...rest} = this.props

    const imgClass = imgClasses[size]
    const divClass = divClasses[size]

    const finalSrc = src && src.trim() ? src : wombatNoAvatar
    const style = {}
    if (!imgClass && +size === size) {
      style.width = size
      style.height = size
      style.minWidth = size
      style.borderRadius = '4%'
    }

    return (
      <div className={divClass}>
        <Link>
          <a href={href} {...rest}>
            <img src={finalSrc} className={imgClass} style={style} alt={title} title={title} />
          </a>
        </Link>
      </div>
    )
  }
}

Avatar.propTypes = {
  src: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.oneOf(['normal', 'small', 'tiny', 'micro', 'inline']), PropTypes.number]),
  title: PropTypes.string,
}

Avatar.defaultProps = {
  size: 'normal',
}

module.exports = Avatar
