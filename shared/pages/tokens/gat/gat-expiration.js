
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/web.dom-collections.iterator.js");
var React = require('react');
var connect = require('../../../components/connect');
var ExpirationDaysInput = require('./expiration-days-input');
var formStyles = require('../../../../shared/styles/forms.css');
var gatStyles = require('../gat.css');
var Input = require('../../../components/inputs/semi-controlled');
var _require = require('./constants'),
  EXPIRATION_DATE_INPUT = _require.EXPIRATION_DATE_INPUT,
  EXPIRATION_OPTIONS = _require.EXPIRATION_OPTIONS,
  EXPIRATION_OPTIONS_READ_WRITE = _require.EXPIRATION_OPTIONS_READ_WRITE,
  PERMISSION_READ_WRITE = _require.PERMISSION_READ_WRITE;
var MS_PER_DAY = 1000 * 60 * 60 * 24;
function GATExpiration(props) {
  var _formData$formId;
  var formId = props.formId,
    formData = props.formData,
    name = props.name,
    label = props.label,
    onInputChange = props.onInputChange,
    validateSingleInput = props.validateSingleInput,
    packagesAndScopesPermission = props.packagesAndScopesPermission,
    orgsPermission = props.orgsPermission,
    _props$isGATReadWrite = props.isGATReadWriteExpirationEnabled,
    isGATReadWriteExpirationEnabled = _props$isGATReadWrite === void 0 ? false : _props$isGATReadWrite;

  // Determine if token has read-write permissions and feature flag is enabled
  var hasReadWritePermissions = isGATReadWriteExpirationEnabled && (packagesAndScopesPermission === PERMISSION_READ_WRITE || orgsPermission === PERMISSION_READ_WRITE);

  // Choose appropriate expiration options and default value
  var expirationOptions = hasReadWritePermissions ? EXPIRATION_OPTIONS_READ_WRITE : EXPIRATION_OPTIONS;
  var defaultExpirationDays = hasReadWritePermissions ? '7' : '30';
  var _React$useState = React.useState(defaultExpirationDays),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    expirationDays = _React$useState2[0],
    setExpirationDays = _React$useState2[1];
  var _React$useState3 = React.useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    expirationDate = _React$useState4[0],
    setExpirationDate = _React$useState4[1];
  var prevPermissionsRef = React.useRef(hasReadWritePermissions);
  var formDataRef = React.useRef(formData);
  var onInputChangeRef = React.useRef(onInputChange);
  var validateSingleInputRef = React.useRef(validateSingleInput);

  // Update refs when props change
  React.useEffect(function () {
    formDataRef.current = formData;
    onInputChangeRef.current = onInputChange;
    validateSingleInputRef.current = validateSingleInput;
  }, [formData, onInputChange, validateSingleInput]);

  // Update expiration when permissions change
  React.useEffect(function () {
    var prevHasReadWrite = prevPermissionsRef.current;

    // Only act when permissions actually change
    if (prevHasReadWrite !== hasReadWritePermissions) {
      if (hasReadWritePermissions && expirationDays !== '7') {
        // Switch to read-write mode - set to 7 days
        setExpirationDays('7');
        setExpirationDate('');
        onInputChangeRef.current(name, '7');
        props.dispatch({
          type: 'FORM_CHANGE',
          formId: formId,
          name: name,
          value: '7'
        });
      } else if (!hasReadWritePermissions) {
        // Switch to read-only mode - always reset to default and clear custom input
        setExpirationDays('30');
        setExpirationDate('');
        onInputChangeRef.current(name, '30');
        props.dispatch({
          type: 'FORM_CHANGE',
          formId: formId,
          name: name,
          value: '30'
        });
      }
    }

    // Update the ref for next time
    prevPermissionsRef.current = hasReadWritePermissions;
  }, [hasReadWritePermissions, packagesAndScopesPermission, orgsPermission, isGATReadWriteExpirationEnabled]);
  var onExpirationSelect = React.useCallback(function (expirationDays) {
    setExpirationDays(expirationDays);
    setExpirationDate('');
    onInputChangeRef.current(name, expirationDays);
    props.dispatch({
      type: 'FORM_CHANGE',
      formId: formId,
      name: name,
      value: expirationDays
    });
  }, [name]);
  var onExpirationDateEntered = React.useCallback(function (date) {
    setExpirationDate(date);
    setExpirationDays('');
    var days = daysTillDate(date).toString();
    onInputChangeRef.current(name, days);
    props.dispatch({
      type: 'FORM_CHANGE',
      formId: formId,
      name: name,
      value: days
    });

    // Trigger validation with updated form data using ref
    if (validateSingleInputRef.current) {
      var _currentFormData$form;
      var currentFormData = formDataRef.current;
      validateSingleInputRef.current(name, _objectSpread(_objectSpread({}, currentFormData), {}, _defineProperty({}, formId, _objectSpread(_objectSpread({}, currentFormData[formId]), {}, _defineProperty({}, name, _objectSpread(_objectSpread({}, (_currentFormData$form = currentFormData[formId]) === null || _currentFormData$form === void 0 ? void 0 : _currentFormData$form[name]), {}, {
        value: days
      }))))));
    }
  }, [name]);
  var inputClassName = "".concat(gatStyles.inputExpirationDate, " ").concat(gatStyles.textInput);
  var labelId = "".concat(formId, "_expiration_section");
  var errorMessageId = "".concat(labelId, "_error_message");
  var errorMessage = (_formData$formId = formData[formId]) === null || _formData$formId === void 0 || (_formData$formId = _formData$formId[name]) === null || _formData$formId === void 0 ? void 0 : _formData$formId.errorMessage;
  var valid = !errorMessage;
  return /*#__PURE__*/React.createElement("div", {
    className: gatStyles.inputContainer
  }, /*#__PURE__*/React.createElement("label", {
    id: labelId,
    className: gatStyles.inputLabelWithBottomSpace
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement(ExpirationDaysInput, {
    formId: formId,
    onSelect: onExpirationSelect,
    outerLabelId: labelId,
    label: label,
    expirationOptions: expirationOptions,
    defaultValue: defaultExpirationDays
  }), expirationDays === '' && /*#__PURE__*/React.createElement(Input, {
    type: "date",
    name: EXPIRATION_DATE_INPUT,
    value: expirationDate,
    min: tomorrowDate(),
    max: hasReadWritePermissions ? maxDateForReadWrite() : undefined,
    className: "".concat(inputClassName, " ").concat(valid ? '' : formStyles.invalid, " "),
    onChange: function onChange(ev) {
      return onExpirationDateEntered(ev.target.value);
    },
    "aria-labelledby": labelId,
    "aria-describedby": errorMessageId,
    "aria-invalid": !!errorMessage,
    role: "textbox"
  })), hasReadWritePermissions && expirationDays === defaultExpirationDays && expirationDate === '' && /*#__PURE__*/React.createElement("p", {
    className: gatStyles.warningText
  }, "Tokens with write access will expire in ", defaultExpirationDays, " days by default (90 days maximum)"), /*#__PURE__*/React.createElement("div", {
    className: formStyles.errorMessage,
    id: errorMessageId
  }, errorMessage));
}
function daysTillDate(date) {
  var now = new Date();
  var expirationDate = new Date(date);
  var diff = expirationDate.getTime() - now.getTime();
  return Math.ceil(diff / MS_PER_DAY);
}
function tomorrowDate() {
  var today = new Date();
  var tomorrow = new Date(today.getTime() + MS_PER_DAY);
  return tomorrow.toISOString().split('T')[0];
}
function maxDateForReadWrite() {
  var now = new Date();
  var maxDate = new Date(now.getTime() + 90 * MS_PER_DAY);
  return maxDate.toISOString().split('T')[0];
}
module.exports = connect()(GATExpiration);
  let __hot__
  
  __registry__.register('tokens/gat/gat-expiration', module.exports, __hot__)
  