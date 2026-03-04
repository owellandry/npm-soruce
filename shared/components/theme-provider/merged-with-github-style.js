'use strict'

const {theme} = require('@primer/react')
const deepmerge = require('deepmerge')

const npmBorderRadius = '3px'

const tachyonsForegroundWhite = 'white'
const black = '#000'

const browserFocusBlueAsShadow = '0 0 0 1px rgba(0, 95, 204, 1)'

const greenBorder = 'border: 1px solid rgba(75, 173, 58, .50)'
const greenBorderHover = '1px solid rgba(75, 173, 58, .60)'
const buttonGradientTextColor = '#444'
const buttonGradientHoverTextColor = '#111'

const npmColors = {
  btn: {
    bg: tachyonsForegroundWhite, // necessary for the outline button
    primary: {
      border: greenBorder,
      hoverBorder: greenBorderHover,
      text: buttonGradientTextColor,
      hoverText: buttonGradientHoverTextColor,
      bg: tachyonsForegroundWhite,
      hoverBg: tachyonsForegroundWhite,
      selectedBg: tachyonsForegroundWhite,
    },
    outline: {
      text: buttonGradientTextColor,
      selectedText: buttonGradientTextColor,
      hoverBg: tachyonsForegroundWhite,
      selectedBg: tachyonsForegroundWhite,
      hoverText: buttonGradientHoverTextColor,
    },
  },
  text: {
    primary: black,
  },
}
const overwriteMerge = (_, sourceArray) => sourceArray

module.exports = deepmerge(
  theme,
  {
    radii: ['0px', npmBorderRadius, npmBorderRadius, npmBorderRadius],
    colorSchemes: {
      light: {
        colors: npmColors,
        shadows: {
          btn: {
            focusShadow: browserFocusBlueAsShadow,
            primary: {
              shadow: 'none',
              focusShadow: browserFocusBlueAsShadow,
            },
            outline: {
              shadow: 'none',
              focusShadow: browserFocusBlueAsShadow,
              hoverShadow: 'none',
            },
          },
        },
      },
    },
  },
  {arrayMerge: overwriteMerge},
)
