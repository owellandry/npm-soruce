
  const __registry__ = require('../../../../../spiferack/client/index.js')
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
var styles = require('../../audit-logs.css');
var Link = require('@npm/spiferack/link');
var OrgFilterAction = /*#__PURE__*/function (_React$PureComponent) {
  "use strict";

  function OrgFilterAction() {
    _classCallCheck(this, OrgFilterAction);
    return _callSuper(this, OrgFilterAction, arguments);
  }
  _inherits(OrgFilterAction, _React$PureComponent);
  return _createClass(OrgFilterAction, [{
    key: "render",
    value: function render() {
      var query = "?q=org:".concat(this.props.filterText || this.props.text);
      return /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
        className: styles.filterActionText,
        href: query
      }, this.props.text)));
    }
  }]);
}(React.PureComponent);
var PackageFilterAction = /*#__PURE__*/function (_React$PureComponent2) {
  "use strict";

  function PackageFilterAction() {
    _classCallCheck(this, PackageFilterAction);
    return _callSuper(this, PackageFilterAction, arguments);
  }
  _inherits(PackageFilterAction, _React$PureComponent2);
  return _createClass(PackageFilterAction, [{
    key: "render",
    value: function render() {
      var query = "?q=package:".concat(this.props.filterText || this.props.text);
      return /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
        className: styles.filterActionText,
        href: query
      }, this.props.text)));
    }
  }]);
}(React.PureComponent);
var TokenFilterAction = /*#__PURE__*/function (_React$PureComponent3) {
  "use strict";

  function TokenFilterAction() {
    _classCallCheck(this, TokenFilterAction);
    return _callSuper(this, TokenFilterAction, arguments);
  }
  _inherits(TokenFilterAction, _React$PureComponent3);
  return _createClass(TokenFilterAction, [{
    key: "render",
    value: function render() {
      var query = "?q=token:\"".concat(this.props.filterText || this.props.text, "\"");
      return /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
        className: styles.filterActionText,
        href: query
      }, this.props.text)));
    }
  }]);
}(React.PureComponent);
var EventFilterAction = /*#__PURE__*/function (_React$PureComponent4) {
  "use strict";

  function EventFilterAction() {
    _classCallCheck(this, EventFilterAction);
    return _callSuper(this, EventFilterAction, arguments);
  }
  _inherits(EventFilterAction, _React$PureComponent4);
  return _createClass(EventFilterAction, [{
    key: "render",
    value: function render() {
      var query = "?q=activity:".concat(this.props.filterText || this.props.text);
      return /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
        className: styles.listItemEventName,
        href: query
      }, this.props.text));
    }
  }]);
}(React.PureComponent);
var IPFilterAction = /*#__PURE__*/function (_React$PureComponent5) {
  "use strict";

  function IPFilterAction() {
    _classCallCheck(this, IPFilterAction);
    return _callSuper(this, IPFilterAction, arguments);
  }
  _inherits(IPFilterAction, _React$PureComponent5);
  return _createClass(IPFilterAction, [{
    key: "render",
    value: function render() {
      var query = "?q=ip:".concat(this.props.filterText || this.props.text);
      return /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
        className: styles.listItemIPAddress,
        href: query
      }, this.props.text));
    }
  }]);
}(React.PureComponent);
module.exports = {
  OrgFilterAction: OrgFilterAction,
  PackageFilterAction: PackageFilterAction,
  EventFilterAction: EventFilterAction,
  IPFilterAction: IPFilterAction,
  TokenFilterAction: TokenFilterAction
};
  let __hot__
  
  __registry__.register('audit-logs/actions/common/filterActions', module.exports, __hot__)
  