const React = require('react')
const PropTypes = require('prop-types')
const {Box} = require('@primer/react')

/**
 * @typedef {'vertical' | 'horizontal' | Array<'vertical' | 'horizontal'>} Direction
 * @typedef {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'left' | 'right'} JustifyContent
 * @typedef {'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'start' | 'end' | 'self-start' | 'self-end'} AlignItems
 * @typedef {'full' | 'auto'} Width
 * @typedef {number} Gap
 */

/**
 * A flexible stack component that arranges its children in a row or column.
 *
 * Should more or less be a drop-in for the `Stack` component in Primer React (which isn't released in the version we use)
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the stack.
 * @param {Direction | Array<Direction>} props.direction - The direction in which to stack the children. Defaults to 'horizontal'.
 * @param {JustifyContent | Array<JustifyContent>} [props.justify='space-between'] - The CSS justify-content value.
 * @param {AlignItems | Array<AlignItems>} [props.align='center'] - The CSS align-items value.
 * @param {Width | Array<Width>} [props.width='full'] - The width of the stack container.
 * @param {Gap | Array<Gap>} [props.gap=0] - The gap between stack children.
 * @returns {JSX.Element} The rendered stack component.
 */
function Stack({children, direction, justify = 'space-between', align = 'center', width = 'full', gap = 0}) {
  const flexDirection = (Array.isArray(direction) ? direction : [direction]).map(dir => {
    switch (dir) {
      case 'vertical':
        return 'column'
      default:
        return 'row'
    }
  })

  const justifyContent = Array.isArray(justify) ? justify : [justify]

  const alignItems = Array.isArray(align) ? align : [align]

  const widthArr = (Array.isArray(width) ? width : [width]).map(w => (w === 'full' ? '100%' : 'auto'))

  const gapArr = Array.isArray(gap) ? gap : [gap]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection,
        justifyContent,
        alignItems,
        width: widthArr,
        gap: gapArr,
      }}
    >
      {children}
    </Box>
  )
}

// This would be nicer with TypeScript

// prettier-ignore
const directionValues = ['horizontal', 'vertical']
// prettier-ignore
const justifyContentValues = [ 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end', 'left', 'right' ]
// prettier-ignore
const alignItemsValues = [ 'flex-start', 'flex-end', 'center', 'baseline', 'stretch', 'start', 'end', 'self-start', 'self-end' ]
// prettier-ignore
const widthValues = ['full', 'auto']

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOfType([
    PropTypes.oneOf(directionValues),
    PropTypes.arrayOf(PropTypes.oneOf(directionValues)),
  ]),
  justify: PropTypes.oneOfType([
    PropTypes.oneOf(justifyContentValues),
    PropTypes.arrayOf(PropTypes.oneOf(justifyContentValues)),
  ]),
  align: PropTypes.oneOfType([PropTypes.oneOf(alignItemsValues), PropTypes.arrayOf(PropTypes.oneOf(alignItemsValues))]),
  width: PropTypes.oneOfType([PropTypes.oneOf(widthValues), PropTypes.arrayOf(PropTypes.oneOf(widthValues))]),
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
}

module.exports = {Stack}
