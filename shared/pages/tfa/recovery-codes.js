
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

var React = require('react');
var styles = require('./list.css');
function RecoveryCodes(props) {
  var manageUrl = props.manageUrl;
  return /*#__PURE__*/React.createElement("div", {
    className: styles.bodyContainer
  }, /*#__PURE__*/React.createElement("div", null, "Use recovery codes to access your account in the event you lose access to your 2FA devices."), /*#__PURE__*/React.createElement("div", {
    className: styles.btnContainer
  }, /*#__PURE__*/React.createElement("a", {
    className: styles.gradientButton,
    href: manageUrl
  }, "Manage Recovery Codes")));
}
module.exports = RecoveryCodes;
  let __hot__
  
  __registry__.register('tfa/recovery-codes', module.exports, __hot__)
  