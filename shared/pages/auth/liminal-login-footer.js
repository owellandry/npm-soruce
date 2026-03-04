
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.string.link.js");
var React = require('react');
var Link = require('@npm/spiferack/link');
var forms = require('../../styles/forms.css');
module.exports = {
  WebAuthnLoginFooter: WebAuthnLoginFooter,
  TotpLoginFooter: TotpLoginFooter,
  AccountRecoverySupportFooter: AccountRecoverySupportFooter,
  WebAuthnEscalateFooter: WebAuthnEscalateFooter,
  TotpEscalateFooter: TotpEscalateFooter,
  AccountRecoverySkipEmailVerification: AccountRecoverySkipEmailVerification,
  PasswordEscalateFooter: PasswordEscalateFooter,
  SignupFooter: SignupFooter,
  BackToSignInFooter: BackToSignInFooter,
  BackToAccessTokensFooter: BackToAccessTokensFooter
};
function GetFooterText() {
  var isPasswordResetFlow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (isPasswordResetFlow) {
    return 'Use a recovery code';
  }
  return 'Use a recovery code or request a reset';
}
function SignupFooter(props) {
  var next = props.next;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FooterTitle, {
    className: forms.signUpPageFooter,
    text: "Already have an account?"
  }), /*#__PURE__*/React.createElement(FooterLink, {
    url: "/login/".concat(next),
    text: "Sign In"
  }));
}
function BackToSignInFooter() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FooterLink, {
    className: forms.signUpPageFooter,
    url: '/login',
    text: "Back to Sign In"
  }));
}
function WebAuthnLoginFooter(props) {
  var hasTotp = props.hasTotp,
    totpUrl = props.totpUrl,
    recoveryCodeUrl = props.recoveryCodeUrl,
    isPasswordResetFlow = props.isPasswordResetFlow;
  var footerText = GetFooterText(isPasswordResetFlow);
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, hasTotp || recoveryCodeUrl ? /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Unable to verify with your security key?"
  }) : null, hasTotp && /*#__PURE__*/React.createElement(FooterLink, {
    url: totpUrl,
    text: "Enter two-factor authentication code"
  }), recoveryCodeUrl ? /*#__PURE__*/React.createElement(FooterLink, {
    url: recoveryCodeUrl,
    text: footerText
  }) : null);
}
function TotpLoginFooter(props) {
  var hasWebAuthnDevices = props.hasWebAuthnDevices,
    webAuthnUrl = props.webAuthnUrl,
    recoveryCodeUrl = props.recoveryCodeUrl,
    isPasswordResetFlow = props.isPasswordResetFlow;
  var footerText = GetFooterText(isPasswordResetFlow);
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, hasWebAuthnDevices || recoveryCodeUrl ? /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Having problems?"
  }) : null, hasWebAuthnDevices && /*#__PURE__*/React.createElement(FooterLink, {
    url: webAuthnUrl,
    text: "Use your security key"
  }), recoveryCodeUrl ? /*#__PURE__*/React.createElement(FooterLink, {
    url: recoveryCodeUrl,
    text: footerText
  }) : null);
}

// TODO need to change link for recovery contact page while integration
function AccountRecoverySupportFooter(props) {
  var accountRecoveryKeyword = props.accountRecoveryKeyword,
    _props$isAutomatedRec = props.isAutomatedRecoveryEnabled,
    isAutomatedRecoveryEnabled = _props$isAutomatedRec === void 0 ? false : _props$isAutomatedRec;
  var recoveryUrl = (isAutomatedRecoveryEnabled ? '/recovery-support/message/' : '/recovery-support/') + accountRecoveryKeyword;
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Locked out?"
  }), /*#__PURE__*/React.createElement(FooterLink, {
    url: "".concat(recoveryUrl),
    text: "Try recovering your account"
  }));
}
function AccountRecoverySkipEmailVerification() {
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Having trouble with your email?"
  }), /*#__PURE__*/React.createElement(FooterLink, {
    url: '/recovery-support/skip-email-flow',
    text: "Skip email verification"
  }));
}
function WebAuthnEscalateFooter(props) {
  var hasTotp = props.hasTotp,
    setEscalateType = props.setEscalateType,
    disable2faPasswordOption = props.disable2faPasswordOption;
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, (hasTotp || !disable2faPasswordOption) && /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Unable to verify with your security key?"
  }), hasTotp && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "totp",
    text: "Enter two-factor authentication code"
  }), !disable2faPasswordOption && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "password",
    text: "Use password"
  }));
}
function TotpEscalateFooter(props) {
  var hasWebAuthnDevices = props.hasWebAuthnDevices,
    setEscalateType = props.setEscalateType,
    disable2faPasswordOption = props.disable2faPasswordOption;
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, (hasWebAuthnDevices || !disable2faPasswordOption) && /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Having problems?"
  }), hasWebAuthnDevices && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "webauthn",
    text: "Use your security key"
  }), !disable2faPasswordOption && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "password",
    text: "Use password"
  }));
}
function PasswordEscalateFooter(props) {
  var hasWebAuthnDevices = props.hasWebAuthnDevices,
    hasTotp = props.hasTotp,
    setEscalateType = props.setEscalateType;
  if (!hasWebAuthnDevices && !hasTotp) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: forms.signUpPageFooter
  }, /*#__PURE__*/React.createElement(FooterTitle, {
    text: "Having problems?"
  }), hasWebAuthnDevices && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "webauthn",
    text: "Use your security key"
  }), hasTotp && /*#__PURE__*/React.createElement(FooterButton, {
    setEscalateType: setEscalateType,
    escalateType: "totp",
    text: "Enter two-factor authentication code"
  }));
}
function BackToAccessTokensFooter(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FooterLink, {
    className: forms.signUpPageFooter,
    url: "/settings/".concat(props.username, "/tokens"),
    text: "Back to Access Tokens"
  }));
}
function FooterLink(props) {
  var classNames = forms.link + props.className;
  return /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
    href: props.url,
    className: classNames
  }, props.text));
}
function FooterTitle(props) {
  return /*#__PURE__*/React.createElement("p", {
    className: "tc ".concat(props.className)
  }, props.text);
}
function FooterButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return props.setEscalateType(props.escalateType);
    },
    className: forms.buttonLink
  }, props.text);
}
  let __hot__
  
  __registry__.register('auth/liminal-login-footer', module.exports, __hot__)
  