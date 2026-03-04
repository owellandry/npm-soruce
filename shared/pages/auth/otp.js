
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.match.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var _require = require('react-helmet'),
  Helmet = _require.Helmet;
var PropTypes = require('prop-types');
var React = require('react');
var GenericInput = require('../../components/inputs/generic');
var GenericForm = require('../../components/forms/generic');
var styles = require('./auth.css');
var LoginLockIcon = require('../../components/icons/login-lock');
var LiminalLoginLayout = require('../../components/layouts/liminal-login');
var UserAvatarHeaderComponent = require('../../components/auth/user-avatar-header-component');
var HiddenInput = require('../../components/inputs/hidden');
var _require2 = require('./liminal-login-footer'),
  TotpLoginFooter = _require2.TotpLoginFooter,
  TotpEscalateFooter = _require2.TotpEscalateFooter;
var CooldownOptin = require('../../components/auth/cooldown-optin');
var OTPLogin = /*#__PURE__*/function (_React$PureComponent) {
  function OTPLogin(props) {
    var _this;
    _classCallCheck(this, OTPLogin);
    _this = _callSuper(this, OTPLogin, [props]);
    _this.state = {
      didOptForCooldown: false
    };
    _this.processCooldownOptIn = _this.processCooldownOptIn.bind(_this);
    return _this;
  }
  _inherits(OTPLogin, _React$PureComponent);
  return _createClass(OTPLogin, [{
    key: "processCooldownOptIn",
    value: function processCooldownOptIn(cooldownChecked) {
      this.setState({
        didOptForCooldown: cooldownChecked
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        setEscalateType = _this$props.setEscalateType,
        isTfaEscalate = _this$props.isTfaEscalate,
        action = _this$props.action,
        _this$props$formData = _this$props.formData,
        formData = _this$props$formData === void 0 ? {} : _this$props$formData,
        hasWebAuthnDevices = _this$props.hasWebAuthnDevices,
        webAuthnUrl = _this$props.webAuthnUrl,
        recoveryCodeUrl = _this$props.recoveryCodeUrl,
        isNewCliLoginFlowEscalation = _this$props.isNewCliLoginFlowEscalation,
        isNewPasswordResetFlowEscalation = _this$props.isNewPasswordResetFlowEscalation,
        isNewPublishAuthEscalation = _this$props.isNewPublishAuthEscalation,
        originalUrl = _this$props.originalUrl,
        disable2faPasswordOption = _this$props.disable2faPasswordOption;
      var onSubmit = null;
      // noop to get default form submit
      if (action.match(/^\/login/)) onSubmit = function onSubmit() {};
      var user = isNewPublishAuthEscalation ? this.props.tokenUser : this.props.user;
      var Header = (isNewCliLoginFlowEscalation || isNewPublishAuthEscalation) && user ? /*#__PURE__*/React.createElement(UserAvatarHeaderComponent, _extends({
        tokenUser: user
      }, this.props)) : 'Two-Factor Authentication';
      var buttonText = isNewPasswordResetFlowEscalation ? 'Verify' : 'Login';
      var Footer;
      if (isTfaEscalate) {
        Footer = /*#__PURE__*/React.createElement(TotpEscalateFooter, {
          hasWebAuthnDevices: hasWebAuthnDevices,
          setEscalateType: setEscalateType,
          disable2faPasswordOption: disable2faPasswordOption
        });
      } else if (isNewPublishAuthEscalation || isNewCliLoginFlowEscalation) {
        Footer = /*#__PURE__*/React.createElement(TotpLoginFooter, {
          hasWebAuthnDevices: hasWebAuthnDevices,
          webAuthnUrl: webAuthnUrl
        });
      } else {
        Footer = /*#__PURE__*/React.createElement(TotpLoginFooter, {
          hasWebAuthnDevices: hasWebAuthnDevices,
          webAuthnUrl: webAuthnUrl,
          recoveryCodeUrl: recoveryCodeUrl,
          isPasswordResetFlow: isNewPasswordResetFlowEscalation
        });
      }
      return /*#__PURE__*/React.createElement(LiminalLoginLayout, {
        Footer: Footer,
        Header: Header
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.login
      }, /*#__PURE__*/React.createElement(Helmet, null, /*#__PURE__*/React.createElement("title", null, "npm | Enter a One-time Password")), /*#__PURE__*/React.createElement(GenericForm, {
        action: action,
        formId: "login",
        formData: formData,
        onSubmit: onSubmit,
        buttonText: buttonText,
        className: "center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tc"
      }, /*#__PURE__*/React.createElement(LoginLockIcon, null)), /*#__PURE__*/React.createElement("h2", {
        className: "mt0 tc"
      }, "Enter One-time Password"), /*#__PURE__*/React.createElement("p", null, "Enter a 6-digit code from your \u2009", /*#__PURE__*/React.createElement("a", {
        href: "https://docs.npmjs.com/configuring-two-factor-authentication#prerequisites"
      }, "authenticator device")), /*#__PURE__*/React.createElement(CooldownOptin, _extends({}, this.props, {
        onCooldownOptinChange: function onCooldownOptinChange() {},
        didOptForCooldown: this.state.didOptForCooldown,
        formData: formData
      })), /*#__PURE__*/React.createElement(GenericInput, {
        inputMode: "numeric",
        autoComplete: "off",
        autoFocus: true,
        name: "otp",
        label: "One-time Password",
        formData: formData
      }), /*#__PURE__*/React.createElement(HiddenInput, {
        formId: "escalate-type",
        name: "formName",
        value: "totp",
        formData: formData
      }), /*#__PURE__*/React.createElement(HiddenInput, {
        formId: "originalUrl",
        name: "originalUrl",
        value: originalUrl,
        formData: formData
      }))));
    }
  }]);
}(React.PureComponent);
OTPLogin.layout = 'none';
OTPLogin.propTypes = {
  action: PropTypes.string.isRequired
};
module.exports = OTPLogin;
  let __hot__
  
  __registry__.register('auth/otp', module.exports, __hot__)
  