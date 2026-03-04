
  const __registry__ = require('../../../spiferack/client/index.js')
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.date.to-primitive.js");
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
var Pagination = require('../../components/pagination/pagination');
var OrgAddUser = require('./actions/orgAddUser');
var OrgCreateTeam = require('./actions/orgCreateTeam');
var OrgDeleteTeam = require('./actions/orgDeleteTeam');
var OrgRemoveUser = require('./actions/orgRemoveUser');
var PackageAddDistTag = require('./actions/packageAddDistTag');
var PackageDeprecate = require('./actions/packageDeprecate');
var PackagePublish = require('./actions/packagePublish');
var PackageRemoveDistTag = require('./actions/packageRemoveDistTag');
var PackageUnpublish = require('./actions/packageUnpublish');
var TeamAddPackage = require('./actions/teamAddPackage');
var TeamAddUser = require('./actions/teamAddUser');
var TeamRemovePackage = require('./actions/teamRemovePackage');
var TeamRemoveUser = require('./actions/teamRemoveUser');
var TeamUpdatePackageAccess = require('./actions/teamUpdatePackageAccess');
var PackageUpdateAccess = require('./actions/packageUpdateAccess');
var _require = require('@npm/audit-log-client'),
  AUDIT_LOG_EVENTS = _require.AUDIT_LOG_EVENTS;
var AuditLogsList = /*#__PURE__*/function (_React$PureComponent) {
  "use strict";

  function AuditLogsList() {
    _classCallCheck(this, AuditLogsList);
    return _callSuper(this, AuditLogsList, arguments);
  }
  _inherits(AuditLogsList, _React$PureComponent);
  return _createClass(AuditLogsList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        logs = _this$props.logs,
        pagination = _this$props.pagination,
        url = _this$props.url,
        total = _this$props.total,
        scope = _this$props.scope;
      var listItems = logs.map(function (log) {
        return /*#__PURE__*/React.createElement(AuditLogsItem, {
          key: log.event_id,
          log: log,
          avatars: scope.parent.avatars
        });
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, listItems, /*#__PURE__*/React.createElement(Pagination, _extends({
        url: url
      }, pagination, {
        total: total,
        className: "mt2"
      })));
    }
  }]);
}(React.PureComponent);
var AuditLogsItem = /*#__PURE__*/function (_React$PureComponent2) {
  "use strict";

  function AuditLogsItem() {
    _classCallCheck(this, AuditLogsItem);
    return _callSuper(this, AuditLogsItem, arguments);
  }
  _inherits(AuditLogsItem, _React$PureComponent2);
  return _createClass(AuditLogsItem, [{
    key: "render",
    value: function render() {
      var log = this.props.log;
      switch (log.event) {
        case AUDIT_LOG_EVENTS.PACKAGE_PUBLISH:
          return /*#__PURE__*/React.createElement(PackagePublish, this.props);
        case AUDIT_LOG_EVENTS.PACKAGE_UNPUBLISH:
          return /*#__PURE__*/React.createElement(PackageUnpublish, this.props);
        case AUDIT_LOG_EVENTS.PACKAGE_DEPRECATE:
          return /*#__PURE__*/React.createElement(PackageDeprecate, this.props);
        case AUDIT_LOG_EVENTS.PACKAGE_ADD_DIST_TAG:
          return /*#__PURE__*/React.createElement(PackageAddDistTag, this.props);
        case AUDIT_LOG_EVENTS.PACKAGE_REMOVE_DIST_TAG:
          return /*#__PURE__*/React.createElement(PackageRemoveDistTag, this.props);
        case AUDIT_LOG_EVENTS.PACKAGE_UPDATE_ACCESS:
          return /*#__PURE__*/React.createElement(PackageUpdateAccess, this.props);
        case AUDIT_LOG_EVENTS.ORG_ADD_TEAM:
          return /*#__PURE__*/React.createElement(OrgCreateTeam, this.props);
        case AUDIT_LOG_EVENTS.ORG_DELETE_TEAM:
          return /*#__PURE__*/React.createElement(OrgDeleteTeam, this.props);
        case AUDIT_LOG_EVENTS.ORG_ADD_USER:
          return /*#__PURE__*/React.createElement(OrgAddUser, this.props);
        case AUDIT_LOG_EVENTS.ORG_REMOVE_USER:
          return /*#__PURE__*/React.createElement(OrgRemoveUser, this.props);
        case AUDIT_LOG_EVENTS.TEAM_ADD_PACKAGE:
          return /*#__PURE__*/React.createElement(TeamAddPackage, this.props);
        case AUDIT_LOG_EVENTS.TEAM_UPDATE_PACKAGE_ACCESS:
          return /*#__PURE__*/React.createElement(TeamUpdatePackageAccess, this.props);
        case AUDIT_LOG_EVENTS.TEAM_REMOVE_PACKAGE:
          return /*#__PURE__*/React.createElement(TeamRemovePackage, this.props);
        case AUDIT_LOG_EVENTS.TEAM_ADD_USER:
          return /*#__PURE__*/React.createElement(TeamAddUser, this.props);
        case AUDIT_LOG_EVENTS.TEAM_REMOVE_USER:
          return /*#__PURE__*/React.createElement(TeamRemoveUser, this.props);
        default:
          return /*#__PURE__*/React.createElement("div", null);
      }
    }
  }]);
}(React.PureComponent);
module.exports = AuditLogsList;
  let __hot__
  
  __registry__.register('audit-logs/list', module.exports, __hot__)
  