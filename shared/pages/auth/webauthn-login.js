
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
var React = require('react');
var WebAuthnLoginForm = require('../../components/auth/webauthn-login-form');
var _require = require('./liminal-login-footer'),
  WebAuthnLoginFooter = _require.WebAuthnLoginFooter,
  WebAuthnEscalateFooter = _require.WebAuthnEscalateFooter;
var LiminalLoginLayout = require('../../components/layouts/liminal-login');
var UserAvatarHeaderComponent = require('../../components/auth/user-avatar-header-component');
var WebAuthnLogin = /*#__PURE__*/function (_React$PureComponent) {
  function WebAuthnLogin() {
    _classCallCheck(this, WebAuthnLogin);
    return _callSuper(this, WebAuthnLogin, arguments);
  }
  _inherits(WebAuthnLogin, _React$PureComponent);
  return _createClass(WebAuthnLogin, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        setEscalateType = _this$props.setEscalateType,
        action = _this$props.action,
        hasTotp = _this$props.hasTotp,
        totpUrl = _this$props.totpUrl,
        recoveryCodeUrl = _this$props.recoveryCodeUrl,
        isNewCliLoginFlowEscalation = _this$props.isNewCliLoginFlowEscalation,
        isNewPublishAuthEscalation = _this$props.isNewPublishAuthEscalation,
        isTfaEscalate = _this$props.isTfaEscalate,
        isNewPasswordResetFlowEscalation = _this$props.isNewPasswordResetFlowEscalation,
        disable2faPasswordOption = _this$props.disable2faPasswordOption;
      var user = isNewPublishAuthEscalation ? this.props.tokenUser : this.props.user;
      var Header = (isNewCliLoginFlowEscalation || isNewPublishAuthEscalation) && user ? /*#__PURE__*/React.createElement(UserAvatarHeaderComponent, _extends({
        tokenUser: user
      }, this.props)) : 'Two-Factor Authentication';
      var Footer;
      if (isTfaEscalate) {
        Footer = /*#__PURE__*/React.createElement(WebAuthnEscalateFooter, {
          hasTotp: hasTotp,
          setEscalateType: setEscalateType,
          action: action,
          disable2faPasswordOption: disable2faPasswordOption
        });
      } else if (isNewPublishAuthEscalation || isNewCliLoginFlowEscalation) {
        Footer = /*#__PURE__*/React.createElement(WebAuthnLoginFooter, {
          hasTotp: hasTotp,
          totpUrl: totpUrl
        });
      } else {
        Footer = /*#__PURE__*/React.createElement(WebAuthnLoginFooter, {
          hasTotp: hasTotp,
          totpUrl: totpUrl,
          recoveryCodeUrl: recoveryCodeUrl,
          isPasswordResetFlow: isNewPasswordResetFlowEscalation
        });
      }
      return /*#__PURE__*/React.createElement(LiminalLoginLayout, {
        Footer: Footer,
        Header: Header
      }, /*#__PURE__*/React.createElement(WebAuthnLoginForm, this.props));
    }
  }]);
}(React.PureComponent);
WebAuthnLogin.layout = 'none';
module.exports = WebAuthnLogin;
  let __hot__
  
  __registry__.register('auth/webauthn-login', module.exports, __hot__)
  