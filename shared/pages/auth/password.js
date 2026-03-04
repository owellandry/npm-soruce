
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
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.string.iterator.js");
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
var PasswordInput = require('../../components/inputs/password');
var GenericForm = require('../../components/forms/generic');
var HiddenInput = require('../../components/inputs/hidden');
var styles = require('./auth.css');
var LiminalLoginLayout = require('../../components/layouts/liminal-login');
var _require2 = require('./liminal-login-footer'),
  PasswordEscalateFooter = _require2.PasswordEscalateFooter;
var Password = /*#__PURE__*/function (_React$Component) {
  function Password() {
    _classCallCheck(this, Password);
    return _callSuper(this, Password, arguments);
  }
  _inherits(Password, _React$Component);
  return _createClass(Password, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        action = _this$props.action,
        _this$props$formData = _this$props.formData,
        formData = _this$props$formData === void 0 ? {} : _this$props$formData,
        hasWebAuthnDevices = _this$props.hasWebAuthnDevices,
        hasTotp = _this$props.hasTotp,
        setEscalateType = _this$props.setEscalateType,
        originalUrl = _this$props.originalUrl;
      var Footer = /*#__PURE__*/React.createElement(PasswordEscalateFooter, {
        hasWebAuthnDevices: hasWebAuthnDevices,
        hasTotp: hasTotp,
        setEscalateType: setEscalateType
      });
      return /*#__PURE__*/React.createElement(LiminalLoginLayout, {
        Footer: Footer
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.login
      }, /*#__PURE__*/React.createElement(Helmet, null, /*#__PURE__*/React.createElement("title", null, "npm | Confirm Password to Continue")), /*#__PURE__*/React.createElement("h1", {
        className: styles.srOnly
      }, "Confirm password to continue"), /*#__PURE__*/React.createElement(GenericForm, {
        key: "form",
        action: action,
        formId: "escalate",
        formData: formData,
        onSubmit: function onSubmit() {} // noop to get default form submit
        ,
        buttonText: "Confirm password to continue",
        className: "ma0"
      }, /*#__PURE__*/React.createElement(HiddenInput, {
        formId: "escalate-type",
        name: "formName",
        value: "password",
        formData: formData
      }), /*#__PURE__*/React.createElement(HiddenInput, {
        formId: "originalUrl",
        name: "originalUrl",
        value: originalUrl,
        formData: formData
      }), /*#__PURE__*/React.createElement(PasswordInput, {
        formData: formData,
        minLength: "0",
        name: "escalated_password",
        autoFocus: true
      }))));
    }
  }]);
}(React.Component);
Password.layout = 'none';
Password.propTypes = {
  action: PropTypes.string.isRequired
};
module.exports = Password;
  let __hot__
  
  __registry__.register('auth/password', module.exports, __hot__)
  