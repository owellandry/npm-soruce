
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
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
var formIdConsumer = require('../../../components/inputs/form-id-consumer');
var gatStyles = require('../gat.css');
var formStyles = require('../../../../shared/styles/forms.css');
var _require = require('./constants'),
  SELECTED_ORGS = _require.SELECTED_ORGS,
  TOTAL_SELECTED_ORGS = _require.TOTAL_SELECTED_ORGS,
  ORGS = _require.ORGS;
var _require2 = require('./utils'),
  orgCompareFn = _require2.orgCompareFn;
var OrganizationsInput = /*#__PURE__*/function (_React$PureComponent) {
  function OrganizationsInput(props) {
    var _this;
    _classCallCheck(this, OrganizationsInput);
    _this = _callSuper(this, OrganizationsInput, [props]);
    _this.onClickOrg = _this.onToggleOrg.bind(_this);
    var allOrgs = _this.props.allOrgs;
    _this.state = {
      orgs: allOrgs.map(function (org) {
        return {
          name: org,
          selected: false
        };
      })
    };
    return _this;
  }
  _inherits(OrganizationsInput, _React$PureComponent);
  return _createClass(OrganizationsInput, [{
    key: "onToggleOrg",
    value: function onToggleOrg(orgName) {
      var orgs = this.state.orgs.map(function (org) {
        if (org.name === orgName) {
          org.selected = !org.selected;
        }
        return org;
      });
      this.setState({
        orgs: orgs
      });
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_ORGS,
        formId: this.props.formId,
        value: orgs.filter(function (org) {
          return org.selected;
        }).map(function (org) {
          return org.name;
        })
      });
      if (orgs.length > 0) {
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: ORGS,
          formId: this.props.formId,
          errorMessage: null
        });
      }
      this.props.onInputChange(TOTAL_SELECTED_ORGS, orgs.filter(function (org) {
        return org.selected;
      }).length);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        formData = _this$props.formData,
        formId = _this$props.formId,
        name = _this$props.name;
      var errorMessage = formData.errorMessage;
      var inputId = formId + '_' + name;
      return /*#__PURE__*/React.createElement("div", {
        className: gatStyles.orgInputContainer
      }, /*#__PURE__*/React.createElement("div", {
        id: "org-input-label"
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "org-input-label",
        className: formStyles.label
      }, "Select organizations")), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.orgListContainer,
        role: "group",
        "aria-labelledby": "org-input-label"
      }, this.state.orgs.sort(orgCompareFn).map(function (org) {
        return /*#__PURE__*/React.createElement("div", {
          key: org.name,
          className: gatStyles.orgInputEntryContainer
        }, /*#__PURE__*/React.createElement("input", {
          type: "checkbox",
          name: org.name,
          id: org.name,
          value: org.name,
          onClick: function onClick() {
            return _this2.onToggleOrg(org.name);
          },
          onKeyDown: function onKeyDown(e) {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }
        }), /*#__PURE__*/React.createElement("label", {
          className: gatStyles.orgInputLabel,
          htmlFor: org.name
        }, org.name));
      })), errorMessage && /*#__PURE__*/React.createElement("div", {
        className: "mt2"
      }, /*#__PURE__*/React.createElement("label", {
        role: "alert",
        htmlFor: inputId,
        className: formStyles.errorMessage
      }, errorMessage)));
    }
  }]);
}(React.PureComponent);
module.exports = connect()(formIdConsumer(OrganizationsInput));
  let __hot__
  
  __registry__.register('tokens/gat/organizations-input', module.exports, __hot__)
  