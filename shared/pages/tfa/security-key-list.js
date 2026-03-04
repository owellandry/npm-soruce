
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

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
require("core-js/modules/es.regexp.to-string.js");
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
var Router = require('@npm/spiferack/router');
var _require = require('../../styles/global.css'),
  a11yOnly = _require.a11yOnly;
var forms = require('../../styles/forms.css');
var styles = require('../../pages/tfa/list.css');
var Time = require('../../components/time');
var TfaTable = require('../../components/tfa-table/tfa-table');
var SecurityKeyList = /*#__PURE__*/function (_React$PureComponent) {
  function SecurityKeyList(props) {
    var _this;
    _classCallCheck(this, SecurityKeyList);
    _this = _callSuper(this, SecurityKeyList, [props]);
    _this.state = {
      deleteInProgress: false,
      deviceCount: props.numWebAuthnDevices,
      errorCount: props.errorCount || 0
    };
    return _this;
  }
  _inherits(SecurityKeyList, _React$PureComponent);
  return _createClass(SecurityKeyList, [{
    key: "deleteSecurityKey",
    value: function deleteSecurityKey(ev, deviceId) {
      ev.preventDefault();
      var _this$props = this.props,
        deleteWebAuthnURL = _this$props.deleteWebAuthnURL,
        totpEnabled = _this$props.totpEnabled,
        numWebAuthnDevices = _this$props.numWebAuthnDevices,
        csrftoken = _this$props.csrftoken;
      this.setState({
        deleteInProgress: true
      });
      var msg = numWebAuthnDevices === 1 && !totpEnabled ? 'Deleting the last 2FA device will disable 2FA on your account. Are you sure?' : 'Are you sure?';
      var confirm = window.confirm(msg);
      if (!confirm) {
        this.setState({
          deleteInProgress: false
        });
        return;
      }
      return Router.get().submit({
        action: deleteWebAuthnURL,
        method: 'POST',
        data: {
          csrftoken: csrftoken,
          errorCount: this.state.errorCount,
          deviceId: deviceId
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props2 = this.props,
        canDelete = _this$props2.canDelete,
        list = _this$props2.list,
        numWebAuthnDevices = _this$props2.numWebAuthnDevices,
        errorCount = _this$props2.errorCount;
      var objects = list.objects;
      if (this.state.deviceCount !== numWebAuthnDevices || this.state.errorCount !== errorCount) {
        this.setState({
          deleteInProgress: false,
          deviceCount: numWebAuthnDevices,
          errorCount: errorCount
        });
      }
      var headings = [/*#__PURE__*/React.createElement("div", {
        key: "security-key"
      }, "Security Key"), /*#__PURE__*/React.createElement("div", {
        key: "created"
      }, "Created"), /*#__PURE__*/React.createElement("div", {
        key: "remove"
      }, "Remove")];
      var rows = objects.map(function (obj) {
        var deviceId = obj.deviceId,
          nickname = obj.nickname,
          created = obj.created;
        return {
          cells: [/*#__PURE__*/React.createElement("div", {
            key: "".concat(nickname)
          }, /*#__PURE__*/React.createElement("span", null, nickname)), /*#__PURE__*/React.createElement(Time, {
            key: "".concat(nickname, "-created"),
            at: {
              ts: Number(new Date(created)),
              rel: moment(new Date(created)).fromNow()
            }
          }), /*#__PURE__*/React.createElement("div", {
            key: "".concat(nickname, "-delete")
          }, /*#__PURE__*/React.createElement("button", {
            "aria-label": "Delete security key ".concat(nickname),
            className: forms.deleteButton,
            disabled: !canDelete.webAuthn || _this2.state.deleteInProgress,
            onClick: function onClick(ev) {
              return _this2.deleteSecurityKey(ev, deviceId);
            }
          }, "\xD7"))],
          key: deviceId.toString(),
          label: "label for ".concat(nickname)
        };
      });
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SecurityKeys, {
        headings: headings,
        rows: rows
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.btnContainer
      }, /*#__PURE__*/React.createElement("a", {
        className: styles.gradientButton,
        href: "manageTfa?action=register-key"
      }, "Add Security Key")));
    }
  }]);
}(React.PureComponent);
function EmptySecurityList() {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.bodyContainer
  }, "You don\u2019t have any security keys registered.");
}
function SecurityKeys(props) {
  if (props.rows.length === 0) {
    return /*#__PURE__*/React.createElement(EmptySecurityList, null);
  } else {
    return /*#__PURE__*/React.createElement(TfaTable, _extends({}, props, {
      ariaLabel: "List of registered security keys"
    }));
  }
}
module.exports = SecurityKeyList;
  let __hot__
  
  __registry__.register('tfa/security-key-list', module.exports, __hot__)
  