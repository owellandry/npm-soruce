
  const __registry__ = require('../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
var Router = require('@npm/spiferack/router');
var React = require('react');
var styles = require('./list.css');
var Banner = require('../../components/banner/banner');
var DisableTfa = /*#__PURE__*/function (_React$PureComponent) {
  function DisableTfa(props) {
    var _this;
    _classCallCheck(this, DisableTfa);
    _this = _callSuper(this, DisableTfa, [props]);
    _defineProperty(_this, "disableTfa", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ev) {
        var confirm;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              ev.preventDefault();
              confirm = window.confirm('This will disable 2FA on your account. Are you sure?');
              if (confirm) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _this.setState({
                deleteInProgress: true
              });
              Router.get().submit({
                action: _this.props.disableTfaUrl,
                method: 'POST',
                data: {
                  csrftoken: _this.props.csrftoken
                }
              });
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    _this.state = {
      deleteInProgress: false
    };
    return _this;
  }
  _inherits(DisableTfa, _React$PureComponent);
  return _createClass(DisableTfa, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        scope = _this$props.scope,
        numTfaEnforcedOrgs = _this$props.numTfaEnforcedOrgs,
        canDelete = _this$props.canDelete,
        userHasEnforcedTFA = _this$props.userHasEnforcedTFA;
      return /*#__PURE__*/React.createElement("div", {
        className: styles.bodyContainer
      }, /*#__PURE__*/React.createElement("div", null, "We strongly recommend using two-factor authentication to secure your account. If you need to disable 2FA, we recommend re-enabling it as soon as possible."), /*#__PURE__*/React.createElement("div", null, canDelete.tfa ? /*#__PURE__*/React.createElement("button", {
        className: styles.deleteGradientButton,
        disabled: this.state.deleteInProgress,
        onClick: function onClick(ev) {
          return _this2.disableTfa(ev);
        }
      }, "Disable 2FA") : /*#__PURE__*/React.createElement(TfaEnforcedBanner, {
        scope: scope,
        numTfaEnforcedOrgs: numTfaEnforcedOrgs,
        userHasEnforcedTFA: userHasEnforcedTFA
      })));
    }
  }]);
}(React.PureComponent);
function TfaEnforcedBanner(props) {
  var scope = props.scope,
    numTfaEnforcedOrgs = props.numTfaEnforcedOrgs,
    userHasEnforcedTFA = props.userHasEnforcedTFA;
  var tfaEnforcementMsg;
  if (userHasEnforcedTFA) {
    tfaEnforcementMsg = /*#__PURE__*/React.createElement("span", {
      className: styles.bannerText
    }, "Two-factor authentication can't be disabled because it is enforced on your npm account. Contact", ' ', /*#__PURE__*/React.createElement("a", {
      className: styles.bannerLink,
      href: "https://www.npmjs.com/support"
    }, "npm support"), ' ', "for any questions.");
  } else if (numTfaEnforcedOrgs > 0) {
    tfaEnforcementMsg = /*#__PURE__*/React.createElement("span", {
      className: styles.bannerText
    }, "Two-factor authentication can't be disabled because you belong to ", numTfaEnforcedOrgs, " organization(s) that require it. Visit your", ' ', /*#__PURE__*/React.createElement("a", {
      className: styles.bannerLink,
      href: "/~".concat(scope.parent.name, "?activeTab=orgs")
    }, "organization settings page"), ' ', "to review which organizations require 2FA.");
  } else {
    return null;
  }
  return /*#__PURE__*/React.createElement(Banner, {
    backgroundColor: "yellow",
    text: tfaEnforcementMsg
  });
}
DisableTfa.layout = 'settings';
module.exports = DisableTfa;
  let __hot__
  
  __registry__.register('tfa/tfa-disable', module.exports, __hot__)
  