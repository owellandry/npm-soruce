
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
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
var PropTypes = require('prop-types');
var formStyles = require('../../../../shared/styles/forms.css');
var types = require('../../../types');
var formIdConsumer = require('../../../components/inputs/form-id-consumer');
var connect = require('../../../components/connect');
var gatStyles = require('../gat.css');
var _require = require('./constants'),
  LINK_CIDR_NOTATION = _require.LINK_CIDR_NOTATION,
  IP_RANGES_ERROR = _require.IP_RANGES_ERROR,
  ADD_IP_RANGES_ERROR = _require.ADD_IP_RANGES_ERROR;
var _require2 = require('../../../utils/aria-live'),
  announce = _require2.announce;
var isCidr4 = require('is-cidr').v4;
var AllowedIPRangesInput = /*#__PURE__*/function (_React$PureComponent) {
  function AllowedIPRangesInput(props) {
    var _this;
    _classCallCheck(this, AllowedIPRangesInput);
    _this = _callSuper(this, AllowedIPRangesInput, [props]);
    _defineProperty(_this, "addButtonRef", React.createRef());
    _defineProperty(_this, "autoFocusInputRef", React.createRef());
    _this.state = {
      focusedIpRange: -1
    };
    return _this;
  }
  _inherits(AllowedIPRangesInput, _React$PureComponent);
  return _createClass(AllowedIPRangesInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.autoFocusInputRef.current && this.state.focusedIpRange >= 0) {
        this.autoFocusInputRef.current.focus();
        this.setState({
          focusedIpRange: -1
        });
      }
    }
  }, {
    key: "onChange",
    value: function onChange(ev, index) {
      var _this2 = this;
      var _this$props = this.props,
        name = _this$props.name,
        formId = _this$props.formId;
      var value = this.props.formData.value;
      var ipRanges = value ? [].concat(_toConsumableArray(value.slice(0, index)), [ev.target.value], _toConsumableArray(value.slice(index + 1))) : [ev.target.value];
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: name,
        formId: formId,
        value: ipRanges
      });
      if (!ipRanges.every(function (ipRange) {
        return _this2.isValidEntry(ipRange);
      })) {
        this.props.dispatch({
          type: 'FORM_VALIDITY_CHECK',
          formId: formId,
          name: name,
          errorMessage: IP_RANGES_ERROR
        });
      }
    }
  }, {
    key: "onAddIPRangeInput",
    value: function onAddIPRangeInput() {
      var _this$props2 = this.props,
        name = _this$props2.name,
        formId = _this$props2.formId;
      var value = this.props.formData.value;
      var errorMessage = this.validationAddNewIp(value);
      if (errorMessage) {
        this.props.dispatch({
          type: 'FORM_VALIDITY_CHECK',
          formId: formId,
          name: name,
          errorMessage: errorMessage
        });
        return;
      }
      var ipRanges = value ? [].concat(_toConsumableArray(value), ['']) : [''];
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: name,
        formId: formId,
        value: ipRanges
      });
      this.setState({
        focusedIpRange: ipRanges.length - 1
      });
      announce('IP range editable field has been added');
    }
  }, {
    key: "onRemoveIPRangeInput",
    value: function onRemoveIPRangeInput(index) {
      var _this$props3 = this.props,
        name = _this$props3.name,
        formId = _this$props3.formId;
      var value = this.props.formData.value;
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: name,
        formId: formId,
        value: [].concat(_toConsumableArray(value.slice(0, index)), _toConsumableArray(value.slice(index + 1)))
      });
      if (this.addButtonRef.current) {
        this.addButtonRef.current.focus();
      }
    }

    // Need to have a valid check for each entry for the UI
    // as only invalid entries should be highlighted with red border.
  }, {
    key: "isValidEntry",
    value: function isValidEntry(ipRange) {
      if (ipRange === undefined || ipRange === '') {
        return true;
      }
      return isCidr4(ipRange);
    }
  }, {
    key: "validationAddNewIp",
    value: function validationAddNewIp(ipRanges) {
      var containInvalidValue = false;
      var _iterator = _createForOfIteratorHelper(ipRanges),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var ipRange = _step.value;
          if (!ipRange) {
            return ADD_IP_RANGES_ERROR;
          }
          if (!this.isValidEntry(ipRange)) {
            containInvalidValue = true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (containInvalidValue) {
        return IP_RANGES_ERROR;
      }
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props4 = this.props,
        formId = _this$props4.formId,
        formData = _this$props4.formData,
        name = _this$props4.name;
      var value = formData.value,
        errorMessage = formData.errorMessage;
      var ipRanges = value || [''];
      var errorMessageId = "".concat(formId, "_").concat(name, "_error_message");
      var labelId = "".concat(formId, "_").concat(name, "_label");
      var describedbyButton = errorMessage ? errorMessageId : undefined;
      return /*#__PURE__*/React.createElement("fieldset", {
        id: "allowed-ip-ranges",
        className: gatStyles.allowedIPRangesContainer
      }, /*#__PURE__*/React.createElement("legend", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "allowed-ip-ranges",
        id: labelId,
        className: gatStyles.inputLabel
      }, "Allowed IP ranges", /*#__PURE__*/React.createElement("span", {
        className: gatStyles.inputLabelOptional
      }, " (optional)")), /*#__PURE__*/React.createElement("caption", {
        className: gatStyles.inputCaption
      }, "Must be valid\xA0", /*#__PURE__*/React.createElement("a", {
        href: LINK_CIDR_NOTATION,
        className: gatStyles.linkAllowedIPRangesCIDRNotation
      }, "CIDR notation"), ".")), /*#__PURE__*/React.createElement("div", null, ipRanges.map(function (ipRange, index) {
        var isValid = _this3.isValidEntry(ipRange);
        var inputId = "".concat(formId, "_").concat(name, "_").concat(index);
        var describedby = errorMessage && !isValid ? "".concat(labelId, " ").concat(errorMessageId) : labelId;
        return /*#__PURE__*/React.createElement("div", {
          key: "".concat(formId, "_").concat(name, "_").concat(index)
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: inputId,
          className: isValid ? "".concat(gatStyles.inputRangeLabel) : "".concat(gatStyles.inputRangeLabelInvalidCIDR)
        }, "Input Range ".concat(index + 1)), /*#__PURE__*/React.createElement("input", {
          ref: _this3.state.focusedIpRange === index ? _this3.autoFocusInputRef : undefined,
          type: "text",
          name: "".concat(formId, "_").concat(name, "_").concat(index),
          id: "".concat(formId, "_").concat(name, "_").concat(index),
          value: ipRange,
          onChange: function onChange(ev) {
            return _this3.onChange(ev, index);
          },
          className: isValid ? "".concat(gatStyles.inputIPRangeValidCIDR) : "".concat(gatStyles.inputIPRangeInvalidCIDR),
          "aria-invalid": !isValid,
          "aria-describedby": describedby
        }), !isValid && /*#__PURE__*/React.createElement("span", {
          className: gatStyles.iconInvalidIPRange
        }, "\u26A0\uFE0F"), index > 0 && /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: function onClick() {
            return _this3.onRemoveIPRangeInput(index);
          },
          "aria-label": "Remove: Allowed IP range ".concat(index + 1),
          className: gatStyles.btnRemoveIPRange
        }, "Remove"));
      })), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return _this3.onAddIPRangeInput();
        },
        className: formStyles.buttonGradient,
        ref: this.addButtonRef,
        "aria-describedby": describedbyButton
      }, "Add IP Range"), errorMessage && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        id: errorMessageId,
        className: formStyles.errorMessage
      }, errorMessage)));
    }
  }]);
}(React.PureComponent);
AllowedIPRangesInput.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  formData: types.formDatum.isRequired
};
AllowedIPRangesInput.defaultProps = {
  formData: {
    value: ['']
  }
};
module.exports = connect()(formIdConsumer(AllowedIPRangesInput));
  let __hot__
  
  __registry__.register('tokens/gat/allowed-ip-ranges-input', module.exports, __hot__)
  