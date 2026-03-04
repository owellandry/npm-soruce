
  const __registry__ = require('../../../../../spiferack/client/index.js')
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.concat.js");
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
var moment = require('moment');
var styles = require('../../audit-logs.css');
var Avatar = require('@npm/design-system/avatar/avatar');
var Space = require('./spaceGap');
var Dot = require('./dot');
var _require = require('./filterActions'),
  TokenFilterAction = _require.TokenFilterAction,
  EventFilterAction = _require.EventFilterAction,
  IPFilterAction = _require.IPFilterAction;
var AuditLogContainer = /*#__PURE__*/function (_React$PureComponent) {
  "use strict";

  function AuditLogContainer() {
    _classCallCheck(this, AuditLogContainer);
    return _callSuper(this, AuditLogContainer, arguments);
  }
  _inherits(AuditLogContainer, _React$PureComponent);
  return _createClass(AuditLogContainer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        log = _this$props.log,
        avatars = _this$props.avatars;
      var token = log.token_name ? log.token_name : "".concat(log.token_prefix, "......").concat(log.token_suffix);
      return /*#__PURE__*/React.createElement("div", {
        className: "".concat(styles.listItem)
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Avatar, {
        key: "avatar",
        size: 32,
        src: avatars && avatars.medium
      })), /*#__PURE__*/React.createElement("div", {
        className: "".concat(styles.listItemTextContainer)
      }, /*#__PURE__*/React.createElement("div", {
        className: "".concat(styles.listItemTextOne)
      }, this.props.children, /*#__PURE__*/React.createElement(Space, null), /*#__PURE__*/React.createElement("span", null, "using token"), /*#__PURE__*/React.createElement(Space, null), /*#__PURE__*/React.createElement(TokenFilterAction, {
        text: token
      })), /*#__PURE__*/React.createElement("div", {
        className: "".concat(styles.listItemTextTwo)
      }, /*#__PURE__*/React.createElement("span", null, "on ".concat(moment(log.timestamp).format('MMMM D, YYYY [at] h:mm A'))), /*#__PURE__*/React.createElement(Dot, null), /*#__PURE__*/React.createElement(EventFilterAction, {
        text: log.event
      }), /*#__PURE__*/React.createElement(Dot, null), /*#__PURE__*/React.createElement(IPFilterAction, {
        text: log.ip
      }))));
    }
  }]);
}(React.PureComponent);
module.exports = AuditLogContainer;
  let __hot__
  
  __registry__.register('audit-logs/actions/common/auditLogContainer', module.exports, __hot__)
  