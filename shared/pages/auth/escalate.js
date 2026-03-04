
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var React = require('react');
var OTPLogin = require('./otp');
var Password = require('./password');
var WebAuthnLogin = require('./webauthn-login');
var Escalate = /*#__PURE__*/function (_React$PureComponent) {
  function Escalate(props) {
    var _this;
    _classCallCheck(this, Escalate);
    _this = _callSuper(this, Escalate, [props]);
    _defineProperty(_this, "setEscalateType", function (newEscalateType) {
      _this.setState({
        escalateType: newEscalateType
      });
    });
    _this.state = {
      escalateType: _this.props.escalateType
    };
    _this.handler = _this.setEscalateType.bind(_this);
    return _this;
  }
  _inherits(Escalate, _React$PureComponent);
  return _createClass(Escalate, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        hasTotp = _this$props.hasTotp,
        hasWebAuthnDevices = _this$props.hasWebAuthnDevices,
        action = _this$props.action,
        publicKeyCredentialRequestOptions = _this$props.publicKeyCredentialRequestOptions,
        csrftoken = _this$props.csrftoken,
        originalUrl = _this$props.originalUrl,
        _this$props$errorCoun = _this$props.errorCount,
        errorCount = _this$props$errorCoun === void 0 ? 0 : _this$props$errorCoun,
        disable2faPasswordOption = _this$props.disable2faPasswordOption;
      switch (this.state.escalateType) {
        case 'webauthn':
          return /*#__PURE__*/React.createElement(WebAuthnLogin, {
            setEscalateType: this.handler,
            hasTotp: hasTotp,
            isTfaEscalate: true,
            publicKeyCredentialRequestOptions: publicKeyCredentialRequestOptions,
            action: action,
            originalUrl: originalUrl,
            csrftoken: csrftoken,
            errorCount: errorCount,
            disable2faPasswordOption: disable2faPasswordOption
          });
        case 'totp':
          return /*#__PURE__*/React.createElement(OTPLogin, {
            setEscalateType: this.handler,
            hasWebAuthnDevices: hasWebAuthnDevices,
            isTfaEscalate: true,
            action: action,
            originalUrl: originalUrl,
            csrftoken: csrftoken,
            disable2faPasswordOption: disable2faPasswordOption
          });
        default:
          return /*#__PURE__*/React.createElement(Password, {
            setEscalateType: this.handler,
            hasWebAuthnDevices: hasWebAuthnDevices,
            hasTotp: hasTotp,
            action: action,
            originalUrl: originalUrl,
            csrftoken: csrftoken
          });
      }
    }
  }]);
}(React.PureComponent);
Escalate.layout = 'none';
module.exports = Escalate;
  let __hot__
  
  __registry__.register('auth/escalate', module.exports, __hot__)
  