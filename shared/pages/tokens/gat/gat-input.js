
  const __registry__ = require('../../../../spiferack/client/index.js')
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["id", "inputClassName", "formData", "label", "labelBeneath", "name", "type", "autoFocus", "onBlur", "onFocus", "required", "disabled", "inputMode", "initialValue", "inputSuffixLabel"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.assign.js");
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
var React = require('react');
var PropTypes = require('prop-types');
var types = require('../../../types');
var Input = require('../../../components/inputs/semi-controlled');
var connect = require('../../../components/connect');
var formStyles = require('../../../../shared/styles/forms.css');
var gatStyles = require('../gat.css');
var formIdConsumer = require('../../../components/inputs/form-id-consumer');
var GATInput = /*#__PURE__*/function (_React$PureComponent) {
  "use strict";

  function GATInput() {
    _classCallCheck(this, GATInput);
    return _callSuper(this, GATInput, arguments);
  }
  _inherits(GATInput, _React$PureComponent);
  return _createClass(GATInput, [{
    key: "onChange",
    value: function onChange(ev) {
      var _this$props = this.props,
        name = _this$props.name,
        formId = _this$props.formId;
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: name,
        formId: formId,
        value: ev.target.value
      });
      this.props.onInputChange && this.props.onInputChange(ev);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props2 = this.props,
        id = _this$props2.id,
        inputClassName = _this$props2.inputClassName,
        formData = _this$props2.formData,
        label = _this$props2.label,
        labelBeneath = _this$props2.labelBeneath,
        name = _this$props2.name,
        type = _this$props2.type,
        autoFocus = _this$props2.autoFocus,
        onBlur = _this$props2.onBlur,
        onFocus = _this$props2.onFocus,
        required = _this$props2.required,
        disabled = _this$props2.disabled,
        inputMode = _this$props2.inputMode,
        initialValue = _this$props2.initialValue,
        inputSuffixLabel = _this$props2.inputSuffixLabel,
        rest = _objectWithoutProperties(_this$props2, _excluded);
      var _formData$value = formData.value,
        value = _formData$value === void 0 ? initialValue : _formData$value,
        errorMessage = formData.errorMessage;
      var valid = !errorMessage;
      var inputId = id || this.props.formId + '_' + name;
      var inputClass = inputClassName + ' ' + gatStyles.textInput;
      var errorClass = formStyles.errorMessage;
      var captionId = "".concat(inputId, "_caption");
      var errorMessageId = "".concat(inputId, "_error_message");
      return /*#__PURE__*/React.createElement("div", {
        className: gatStyles.inputContainer
      }, /*#__PURE__*/React.createElement("label", {
        className: gatStyles.inputLabel,
        htmlFor: inputId
      }, label), /*#__PURE__*/React.createElement("caption", {
        className: gatStyles.inputCaption,
        id: captionId
      }, labelBeneath), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, _extends({
        autoFocus: autoFocus,
        id: inputId,
        type: type,
        required: required,
        className: "".concat(inputClass, "  ").concat(valid ? '' : formStyles.invalid),
        onChange: function onChange(ev) {
          return _this.onChange(ev);
        },
        onBlur: onBlur,
        onFocus: onFocus,
        name: name,
        value: value,
        disabled: disabled,
        inputMode: inputMode,
        "aria-describedby": "".concat(captionId, " ").concat(errorMessageId),
        "aria-invalid": !!errorMessage
      }, rest)), inputSuffixLabel && inputSuffixLabel, errorMessage && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        id: errorMessageId,
        className: errorClass
      }, errorMessage))));
    }
  }]);
}(React.PureComponent);
GATInput.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  formData: types.formDatum.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool
};
GATInput.defaultProps = {
  type: 'text',
  required: false,
  autoFocus: false
};
module.exports = connect()(formIdConsumer(GATInput));
  let __hot__
  
  __registry__.register('tokens/gat/gat-input', module.exports, __hot__)
  