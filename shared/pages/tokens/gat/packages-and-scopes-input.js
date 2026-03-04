
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.starts-with.js");
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
var formStyles = require('../../../../shared/styles/forms.css');
var _require = require('./constants'),
  SELECTED_PACKAGES_AND_SCOPES_ALL = _require.SELECTED_PACKAGES_AND_SCOPES_ALL,
  SELECTED_PACKAGES_AND_SCOPES_SOME = _require.SELECTED_PACKAGES_AND_SCOPES_SOME,
  SELECTED_PACKAGES = _require.SELECTED_PACKAGES,
  SELECTED_SCOPES = _require.SELECTED_SCOPES,
  SELECTED_PACKAGES_AND_SCOPES = _require.SELECTED_PACKAGES_AND_SCOPES,
  TOTAL_SELECTED_SCOPES = _require.TOTAL_SELECTED_SCOPES,
  TOTAL_SELECTED_PACKAGES = _require.TOTAL_SELECTED_PACKAGES,
  MAX_ALLOWED_PACKAGES_SELECTED = _require.MAX_ALLOWED_PACKAGES_SELECTED,
  PACKAGES_AND_SCOPES = _require.PACKAGES_AND_SCOPES;
var gatStyles = require('../gat.css');
var _require2 = require('@primer/react'),
  SelectMenu = _require2.SelectMenu,
  Button = _require2.Button;
var withThemeProvider = require('../../../components/theme-provider');
var Divider = require('./divider');
var DropdownIcon = require('../../../components/icons/dropdown-caret');
var SelectedItems = require('./selected-items');
var formIdConsumer = require('../../../components/inputs/form-id-consumer');
var _require3 = require('./utils'),
  pkgCompareFn = _require3.pkgCompareFn,
  scopeCompareFn = _require3.scopeCompareFn;
var PackagesAndScopesInput = /*#__PURE__*/function (_React$PureComponent) {
  function PackagesAndScopesInput(props) {
    var _this;
    _classCallCheck(this, PackagesAndScopesInput);
    _this = _callSuper(this, PackagesAndScopesInput, [props]);
    _this.setSelectedPackagesAndScopes = _this.setSelectedPackagesAndScopes.bind(_this);
    _this.onScopeSelect = _this.onScopeSelect.bind(_this);
    _this.onPackageSelect = _this.onPackageSelect.bind(_this);
    _this.onScopeDeselect = _this.onScopeDeselect.bind(_this);
    _this.onPackageDeselect = _this.onPackageDeselect.bind(_this);
    _this.announceMessage = _this.announceMessage.bind(_this);
    _this.selectedScopesRef = React.createRef();
    _this.selectedPackagesRef = React.createRef();
    _this.state = {
      announceResultFound: false,
      searchText: '',
      selectedPackagesAndScopes: '',
      availableScopes: _toConsumableArray(props.allScopes).sort(scopeCompareFn),
      availablePackages: _toConsumableArray(props.allPackages).sort(pkgCompareFn),
      selectedScopes: [],
      selectedPackages: []
    };
    return _this;
  }
  _inherits(PackagesAndScopesInput, _React$PureComponent);
  return _createClass(PackagesAndScopesInput, [{
    key: "setSelectedPackagesAndScopes",
    value: function setSelectedPackagesAndScopes(option) {
      this.props.onInputChange(SELECTED_PACKAGES_AND_SCOPES, option);
      this.setState({
        selectedPackagesAndScopes: option
      });
      var formId = this.props.formId;
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_PACKAGES_AND_SCOPES,
        formId: formId,
        value: option
      });
      if (option === SELECTED_PACKAGES_AND_SCOPES_ALL) {
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: SELECTED_PACKAGES,
          formId: formId,
          value: []
        });
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: SELECTED_SCOPES,
          formId: formId,
          value: []
        });
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: PACKAGES_AND_SCOPES,
          formId: formId,
          errorMessage: null
        });
        this.props.onInputChange(TOTAL_SELECTED_SCOPES, 0);
        this.props.onInputChange(TOTAL_SELECTED_PACKAGES, 0);
      } else {
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: SELECTED_PACKAGES,
          formId: formId,
          value: this.state.selectedPackages
        });
        this.props.dispatch({
          type: 'FORM_CHANGE',
          name: SELECTED_SCOPES,
          formId: formId,
          value: this.state.selectedScopes
        });
      }
    }
  }, {
    key: "onScopeSelect",
    value: function onScopeSelect(scope) {
      var _this2 = this;
      var selectedScopes = [].concat(_toConsumableArray(this.state.selectedScopes), [scope]);
      var selectedPackages = this.state.selectedPackages.filter(function (p) {
        return !p.startsWith(scope + '/');
      });
      var availableScopes = this.state.availableScopes.filter(function (s) {
        return s !== scope;
      });
      var availablePackages = this.state.availablePackages.filter(function (p) {
        return !p.startsWith(scope + '/');
      });
      this.setState({
        selectedScopes: selectedScopes.sort(scopeCompareFn),
        availableScopes: availableScopes.sort(scopeCompareFn),
        availablePackages: availablePackages.sort(pkgCompareFn),
        selectedPackages: selectedPackages.sort(pkgCompareFn),
        searchText: ''
      }, function () {
        _this2.selectedScopesRef.current.focus();
      });
      var formId = this.props.formId;
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_SCOPES,
        formId: formId,
        value: _toConsumableArray(selectedScopes)
      });
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_PACKAGES,
        formId: formId,
        value: _toConsumableArray(selectedPackages)
      });
      this.props.onInputChange(TOTAL_SELECTED_SCOPES, selectedScopes.length);
      this.props.onInputChange(TOTAL_SELECTED_PACKAGES, selectedPackages.length);

      // Remove the scope/package selection error on a scope/package select
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: PACKAGES_AND_SCOPES,
        formId: formId,
        errorMessage: null
      });
    }
  }, {
    key: "onPackageSelect",
    value: function onPackageSelect(pkg) {
      var _this3 = this;
      var selectedPackages = [].concat(_toConsumableArray(this.state.selectedPackages), [pkg]);
      var availablePackages = this.state.availablePackages.filter(function (s) {
        return s !== pkg;
      });
      this.setState({
        selectedPackages: selectedPackages.sort(pkgCompareFn),
        availablePackages: availablePackages.sort(pkgCompareFn),
        searchText: ''
      }, function () {
        _this3.selectedPackagesRef.current.focus();
      });
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_PACKAGES,
        formId: this.props.formId,
        value: _toConsumableArray(selectedPackages)
      });
      this.props.onInputChange(TOTAL_SELECTED_PACKAGES, selectedPackages.length);
      // Remove the scope/package selection error on a scope/package select
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: PACKAGES_AND_SCOPES,
        formId: this.props.formId,
        errorMessage: null
      });
    }
  }, {
    key: "onScopeDeselect",
    value: function onScopeDeselect(scope) {
      var selectedScopes = this.state.selectedScopes.filter(function (s) {
        return s !== scope;
      });
      var availableScopes = [].concat(_toConsumableArray(this.state.availableScopes), [scope]);
      var availablePackages = [].concat(_toConsumableArray(this.state.availablePackages), _toConsumableArray(this.props.allPackages.filter(function (p) {
        return p.startsWith(scope + '/');
      })));
      this.setState({
        selectedScopes: selectedScopes.sort(scopeCompareFn),
        availableScopes: availableScopes.sort(scopeCompareFn),
        availablePackages: availablePackages.sort(pkgCompareFn)
      });
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_SCOPES,
        formId: this.props.formId,
        value: _toConsumableArray(selectedScopes)
      });
      this.props.onInputChange(TOTAL_SELECTED_SCOPES, selectedScopes.length);
    }
  }, {
    key: "onPackageDeselect",
    value: function onPackageDeselect(pkg) {
      var selectedPackages = this.state.selectedPackages.filter(function (s) {
        return s !== pkg;
      });
      var availablePackages = [].concat(_toConsumableArray(this.state.availablePackages), [pkg]);
      this.setState({
        selectedPackages: selectedPackages.sort(pkgCompareFn),
        availablePackages: availablePackages.sort(pkgCompareFn)
      });
      this.props.dispatch({
        type: 'FORM_CHANGE',
        name: SELECTED_PACKAGES,
        formId: this.props.formId,
        value: _toConsumableArray(selectedPackages)
      });
      this.props.onInputChange(TOTAL_SELECTED_PACKAGES, selectedPackages.length);
    }
  }, {
    key: "announceMessage",
    value: function announceMessage() {
      var _this4 = this;
      var scopes = this.state.availableScopes.filter(function (s) {
        return s.toLowerCase().includes(_this4.state.searchText.toLowerCase());
      });
      var packages = this.state.availablePackages.filter(function (s) {
        return s.toLowerCase().includes(_this4.state.searchText.toLowerCase());
      });
      var message = "".concat(scopes.length + packages.length, " results found");
      var searchResult = document.querySelector('#searchResult');
      if (!searchResult) return;
      if (searchResult.textContent === message) {
        searchResult.textContent = "".concat(message, " \xA0");
      } else {
        searchResult.textContent = message;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      var _this$props = this.props,
        formData = _this$props.formData,
        formId = _this$props.formId,
        name = _this$props.name;
      var errorMessage = formData.errorMessage;
      var inputId = formId + '_' + name;
      var listId = "".concat(inputId, "_list");
      var scopesHeadingId = "".concat(inputId, "__menu_scopes");
      var packagesHeadingId = "".concat(inputId, "__menu_packages");
      var scopes = this.state.availableScopes.filter(function (s) {
        return s.toLowerCase().includes(_this5.state.searchText.toLowerCase());
      });
      var packages = this.state.availablePackages.filter(function (s) {
        return s.toLowerCase().includes(_this5.state.searchText.toLowerCase());
      });
      var scopesCount = this.state.selectedScopes.length;
      var pkgsCount = this.state.selectedPackages.length;
      var selectedItemGroups = [{
        label: scopesCount === 1 ? "".concat(scopesCount, " scope selected") : "".concat(scopesCount, " scopes selected"),
        onClick: this.onScopeDeselect.bind(this),
        items: this.state.selectedScopes,
        refLabel: this.selectedScopesRef
      }, {
        label: pkgsCount === 1 ? "".concat(pkgsCount, " package selected") : "".concat(pkgsCount, " packages selected"),
        onClick: this.onPackageDeselect.bind(this),
        items: this.state.selectedPackages,
        refLabel: this.selectedPackagesRef
      }];
      var startScopesPosInSet = 2 + (this.state.announceResultFound ? 1 : 0);
      var startPackagesPosInSet = startScopesPosInSet + scopes.length;
      var ariaMenuSetSize = startScopesPosInSet + packages.length;
      return /*#__PURE__*/React.createElement("fieldset", {
        id: "select-packages",
        className: gatStyles.fieldset
      }, /*#__PURE__*/React.createElement("legend", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "select-packages",
        className: formStyles.label
      }, "Select packages")), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.radioSelectPackages
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: gatStyles.radioSelectPackageContainer
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        name: SELECTED_PACKAGES_AND_SCOPES,
        id: SELECTED_PACKAGES_AND_SCOPES_ALL,
        onClick: function onClick() {
          return _this5.setSelectedPackagesAndScopes(SELECTED_PACKAGES_AND_SCOPES_ALL);
        },
        "aria-posinset": "1",
        "aria-setsize": "2",
        "aria-describedby": "".concat(SELECTED_PACKAGES_AND_SCOPES_ALL, "-description")
      })), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.radioSelectPackageLabelContainer
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: SELECTED_PACKAGES_AND_SCOPES_ALL,
        className: gatStyles.radioSelectPackageLabel
      }, "All packages"), /*#__PURE__*/React.createElement("p", {
        id: "".concat(SELECTED_PACKAGES_AND_SCOPES_ALL, "-description"),
        className: formStyles.labelBeneath
      }, "Applies to current and future packages."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: gatStyles.radioSelectPackageContainer
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        name: SELECTED_PACKAGES_AND_SCOPES,
        id: SELECTED_PACKAGES_AND_SCOPES_SOME,
        onClick: function onClick() {
          return _this5.setSelectedPackagesAndScopes(SELECTED_PACKAGES_AND_SCOPES_SOME);
        },
        "aria-posinset": "2",
        "aria-setsize": "2",
        "aria-describedby": "".concat(SELECTED_PACKAGES_AND_SCOPES_SOME, "-description"),
        onKeyDown: function onKeyDown(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.radioSelectPackageLabelContainer
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: SELECTED_PACKAGES_AND_SCOPES_SOME,
        className: gatStyles.radioSelectPackageLabel
      }, "Only select packages and scopes"), /*#__PURE__*/React.createElement("p", {
        id: "".concat(SELECTED_PACKAGES_AND_SCOPES_SOME, "-description"),
        className: formStyles.labelBeneath
      }, "Select at least one. Max ", MAX_ALLOWED_PACKAGES_SELECTED, "."), this.state.selectedPackagesAndScopes === SELECTED_PACKAGES_AND_SCOPES_SOME && /*#__PURE__*/React.createElement("div", null, this.state.selectedPackages.length + this.state.selectedScopes.length < MAX_ALLOWED_PACKAGES_SELECTED && /*#__PURE__*/React.createElement(SelectMenu, null, /*#__PURE__*/React.createElement(Button, {
        as: "summary",
        id: gatStyles.dropdownButtonPackages,
        onClick: function onClick() {
          var searchResult = document.querySelector('#searchResult');
          if (!searchResult) return;
          searchResult.textContent = '';
        }
      }, "Select packages and scopes", ' ', /*#__PURE__*/React.createElement("span", {
        className: 'ml2'
      }, /*#__PURE__*/React.createElement(DropdownIcon, null))), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.selectMenuContainer
      }, /*#__PURE__*/React.createElement(SelectMenu.Filter, {
        title: "Search packages and scopes",
        placeholder: "Filter packages and scopes...",
        "aria-label": "Filter packages and scopes...",
        value: this.state.searchText,
        onChange: function onChange(ev) {
          _this5.setState({
            searchText: ev.target.value
          }, function () {
            _this5.announceMessage();
          });
        },
        onFocus: function onFocus(ev) {
          var message = "".concat(scopes.length + packages.length, " results found");
          var searchResult = document.querySelector('#searchResult');
          setTimeout(function () {
            if (!searchResult) return;
            if (searchResult.textContent === message) {
              searchResult.textContent = "".concat(message, " \xA0");
            } else {
              searchResult.textContent = message;
            }
          }, 100);
        },
        onKeyPress: function onKeyPress(ev) {
          if (ev.key === 'Enter') {
            ev.preventDefault();
          }
        },
        onKeyDown: function onKeyDown() {
          return _this5.setState({
            announceResultFound: false
          });
        },
        onKeyUp: function onKeyUp() {
          return _this5.setState({
            announceResultFound: true
          });
        },
        role: "combobox",
        "aria-controls": listId,
        "aria-expanded": "true",
        className: gatStyles.selectMenuFilter
      }), /*#__PURE__*/React.createElement("div", {
        className: gatStyles.srOnly,
        role: "region",
        id: listId,
        "aria-atomic": "true",
        "aria-live": "polite"
      }, /*#__PURE__*/React.createElement("p", {
        id: "searchResult"
      })), /*#__PURE__*/React.createElement(SelectMenu.List, {
        id: listId,
        role: "menu",
        className: gatStyles.selectMenuList
      }, scopes.length > 0 && /*#__PURE__*/React.createElement(SelectMenu.Divider, {
        id: scopesHeadingId,
        role: "presentation",
        className: gatStyles.selectMenuDivider
      }, "Scopes"), scopes.length > 0 && scopes.map(function (scope, index) {
        var idLabel = "".concat(inputId, "_menu_scope_label_").concat(scope);
        return /*#__PURE__*/React.createElement(SelectMenu.Item, {
          "aria-labelledby": "".concat(idLabel, " ").concat(scopesHeadingId),
          className: gatStyles.selectItem,
          as: "button",
          key: scope,
          onClick: function onClick() {
            return _this5.onScopeSelect(scope);
          }
        }, /*#__PURE__*/React.createElement("label", {
          id: idLabel,
          role: "presentation"
        }, scope));
      }), packages.length > 0 && /*#__PURE__*/React.createElement(Divider, {
        classNames: gatStyles.selectListGroupDivider
      }), packages.length > 0 && /*#__PURE__*/React.createElement(SelectMenu.Divider, {
        id: packagesHeadingId,
        role: "presentation",
        className: gatStyles.selectMenuDivider
      }, "Packages"), packages.length > 0 && packages.map(function (pkg, index) {
        var idLabel = "".concat(inputId, "_menu_package_label_").concat(pkg);
        return /*#__PURE__*/React.createElement(SelectMenu.Item, {
          "aria-labelledby": "".concat(idLabel, " ").concat(packagesHeadingId),
          className: gatStyles.selectItem,
          as: "button",
          key: pkg,
          onClick: function onClick() {
            return _this5.onPackageSelect(pkg);
          }
        }, /*#__PURE__*/React.createElement("label", {
          id: idLabel,
          role: "presentation"
        }, pkg));
      })))), /*#__PURE__*/React.createElement(SelectedItems, {
        itemGroups: selectedItemGroups
      }))))), errorMessage && /*#__PURE__*/React.createElement("div", {
        className: "nt2"
      }, /*#__PURE__*/React.createElement("label", {
        role: "alert",
        htmlFor: inputId,
        className: formStyles.errorMessage
      }, errorMessage)));
    }
  }]);
}(React.PureComponent);
module.exports = connect()(formIdConsumer(withThemeProvider(PackagesAndScopesInput)));
  let __hot__
  
  __registry__.register('tokens/gat/packages-and-scopes-input', module.exports, __hot__)
  