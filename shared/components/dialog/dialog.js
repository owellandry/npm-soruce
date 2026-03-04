'use strict'

const React = require('react')
const PropTypes = require('prop-types')

const {ButtonOutline, ButtonPrimary, Dialog: PrimerDialog, Flex, Box} = require('@primer/react')
const withThemeProvider = require('../theme-provider')
const styles = require('./dialog.css')

function Dialog(props) {
  const {isOpen, onClick, headerText, cancelText, doActionText, ariaLabelledBy, children, onDismiss} = props

  const headerId = 'header-id'
  const ariaLabelledById = headerText ? headerId : ariaLabelledBy

  return (
    <div className={isOpen ? styles.overlay : undefined}>
      <PrimerDialog
        isOpen={isOpen}
        sx={{
          width: '600px',
          '& button[aria-label="Close"]:focus': {
            border: '1px solid rgba(75, 173, 58, 0.5)',
          },
          '& button[aria-label="Close"]:hover': {
            border: '1px solid rgba(75, 173, 58, 0.6)',
          },
          '@media (prefers-contrast: high)': {
            '& .buttonOutline:focus-visible, & .buttonOutline:focus': {
              outline: '3px solid Canvas !important',
              outlineOffset: '2px !important',
              backgroundColor: 'currentColor !important',
              color: 'Canvas !important',
              border: '2px solid Canvas !important',
              borderRadius: '4px !important',
            },
            '& .buttonOutline:hover': {
              outline: '2px solid Canvas !important',
              outlineOffset: '1px !important',
              backgroundColor: 'currentColor !important',
              color: 'Canvas !important',
              border: '2px solid Canvas !important',
              borderRadius: '4px !important',
              opacity: '0.9 !important',
            },
          },
        }}
        className={styles.dialog}
        onDismiss={onDismiss}
        aria-labelledby={ariaLabelledById}
      >
        {headerText && <PrimerDialog.Header id={headerId}>{headerText}</PrimerDialog.Header>}
        <Box p={3}>
          {children}
          <Flex mt={3} justifyContent="flex-end">
            {cancelText && (
              <ButtonOutline mr={1} className={styles.buttonOutline} onClick={onDismiss}>
                {cancelText}
              </ButtonOutline>
            )}
            {onClick && (
              <ButtonPrimary className={styles.buttonPrimary} onClick={onClick}>
                {doActionText || 'Okay'}
              </ButtonPrimary>
            )}
          </Flex>
        </Box>
      </PrimerDialog>
    </div>
  )
}

Dialog.propTypes = {
  onClick: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  headerText: PropTypes.string,
  cancelText: PropTypes.string,
  doActionText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  ariaLabelledBy: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

module.exports = withThemeProvider(Dialog)
