
  const __registry__ = require('../../../../spiferack/client/index.js')
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
var React = require('react');
var connect = require('../../../components/connect');
var _require = require('./constants'),
  PERMISSION_NO_ACCESS = _require.PERMISSION_NO_ACCESS,
  PACKAGES_AND_SCOPES_PERMISSION = _require.PACKAGES_AND_SCOPES_PERMISSION,
  SELECTED_PACKAGES_AND_SCOPES = _require.SELECTED_PACKAGES_AND_SCOPES,
  SELECTED_SCOPES = _require.SELECTED_SCOPES,
  SELECTED_PACKAGES = _require.SELECTED_PACKAGES,
  PACKAGES_AND_SCOPES = _require.PACKAGES_AND_SCOPES;
var PackagesAndScopesInput = require('./packages-and-scopes-input');
var PermissionsInput = require('./permissions-input');
var formStyles = require('../../../../shared/styles/forms.css');
var SectionHeading = require('./section-heading');
var PackagesAndScopesSection = /*#__PURE__*/function (_React$PureComponent) {
  function PackagesAndScopesSection(props) {
    var _this;
    _classCallCheck(this, PackagesAndScopesSection);
    _this = _callSuper(this, PackagesAndScopesSection, [props]);
    _this.state = {
      permission: PERMISSION_NO_ACCESS
    };
    _this.onPermissionSelect = _this.onPermissionSelect.bind(_this);
    return _this;
  }
  _inherits(PackagesAndScopesSection, _React$PureComponent);
  return _createClass(PackagesAndScopesSection, [{
    key: "onPermissionSelect",
    value: function onPermissionSelect(permission) {
      this.setState({
        permission: permission
      });
      this.props.onInputChange(PACKAGES_AND_SCOPES_PERMISSION, permission);
      // Reset the selection if no access is selected
      if (permission === PERMISSION_NO_ACCESS) {
        this.props.dispatch({
          type: 'FORM_CHANGE',
          formId: this.props.formId,
          name: SELECTED_PACKAGES_AND_SCOPES,
          value: ''
        });
        this.props.dispatch({
          type: 'FORM_CHANGE',
          formId: this.props.formId,
          name: SELECTED_SCOPES,
          value: []
        });
        this.props.dispatch({
          type: 'FORM_CHANGE',
          formId: this.props.formId,
          name: SELECTED_PACKAGES,
          value: []
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _formData$formId;
      var _this$props = this.props,
        formId = _this$props.formId,
        formData = _this$props.formData,
        allScopes = _this$props.allScopes,
        allPackages = _this$props.allPackages,
        onInputChange = _this$props.onInputChange;
      var sectionId = "".concat(formId, "_packages_section");
      var errorMessageId = "".concat(sectionId, "_error_message");
      var errorMessage = (_formData$formId = formData[formId]) === null || _formData$formId === void 0 || (_formData$formId = _formData$formId[PACKAGES_AND_SCOPES_PERMISSION]) === null || _formData$formId === void 0 ? void 0 : _formData$formId.errorMessage;
      return /*#__PURE__*/React.createElement(SectionHeading, {
        title: "Packages and scopes",
        id: sectionId
      }, /*#__PURE__*/React.createElement(PermissionsInput, {
        formId: formId,
        name: PACKAGES_AND_SCOPES_PERMISSION,
        onSelect: this.onPermissionSelect,
        outerLabelId: sectionId,
        isInvalid: !!errorMessage,
        ariaDescribedby: errorMessageId
      }), this.state.permission !== PERMISSION_NO_ACCESS && /*#__PURE__*/React.createElement(PackagesAndScopesInput, {
        formId: formId,
        formData: formData,
        name: PACKAGES_AND_SCOPES,
        allScopes: allScopes,
        allPackages: allPackages,
        onInputChange: onInputChange
      }), /*#__PURE__*/React.createElement("p", {
        id: errorMessageId,
        className: formStyles.errorMessage
      }, errorMessage));
    }
  }]);
}(React.PureComponent);
module.exports = connect()(PackagesAndScopesSection);
  let __hot__
  
  __registry__.register('tokens/gat/packages-and-scopes-section', module.exports, __hot__)
  