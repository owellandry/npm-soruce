
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _require = require('@primer/react'),
  SelectMenu = _require.SelectMenu,
  Button = _require.Button;
var React = require('react');
var _require2 = require('react'),
  useContext = _require2.useContext;
var connect = require('../../../components/connect');
var withThemeProvider = require('../../../components/theme-provider');
var gatStyles = require('../gat.css');
var DropdownIcon = require('../../../components/icons/dropdown-caret');
var _require3 = require('./constants'),
  EXPIRATION_OPTIONS = _require3.EXPIRATION_OPTIONS;
function ExpirationDaysInput(props) {
  var onSelect = props.onSelect,
    outerLabelId = props.outerLabelId,
    isInvalid = props.isInvalid,
    label = props.label,
    _props$expirationOpti = props.expirationOptions,
    expirationOptions = _props$expirationOpti === void 0 ? EXPIRATION_OPTIONS : _props$expirationOpti,
    _props$defaultValue = props.defaultValue,
    defaultValue = _props$defaultValue === void 0 ? '30' : _props$defaultValue;
  var _React$useState = React.useState(defaultValue),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    selectedExpirationDays = _React$useState2[0],
    setSelectedExpirationDays = _React$useState2[1];

  // Update selected expiration when defaultValue changes (e.g., when permissions change)
  React.useEffect(function () {
    if (selectedExpirationDays !== defaultValue && expirationOptions[defaultValue] !== undefined) {
      setSelectedExpirationDays(defaultValue);
    }
  }, [defaultValue, expirationOptions]);
  var menuId = 'expiration-days-menu';
  function _onClick(expiration) {
    setSelectedExpirationDays(expiration);
    onSelect && onSelect(expiration);
  }
  function _onBlur(e, setOpen) {
    // If focus moved to something else than a menu item, then close select menu
    if (!e.relatedTarget || !e.relatedTarget.className.includes(gatStyles.expirationDaysEntry)) {
      setOpen(false);
    }
  }
  var selectMenuButtonStyleOverrides = {
    letterSpacing: '0.25px',
    backgroundColor: '#fff',
    backgroundImage: 'linear-gradient(-180deg, rgba(255,255,255,0.09) 0%, rgba(17,17,17,0.04) 100%)',
    border: '1px solid rgba(22,22,22,0.20)',
    color: '#000',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500'
  };
  var SelectModal = function SelectModal() {
    var menuContext = useContext(SelectMenu.MenuContext);
    return /*#__PURE__*/React.createElement(SelectMenu.Modal, {
      className: gatStyles.expirationDaysMenuModal,
      id: menuId,
      role: "menu"
    }, /*#__PURE__*/React.createElement(SelectMenu.List, {
      className: gatStyles.expirationDaysEntryList
    }, Object.entries(expirationOptions).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[0],
        label = _ref2[1];
      return /*#__PURE__*/React.createElement(SelectMenu.Item, {
        selected: selectedExpirationDays === value,
        "aria-checked": selectedExpirationDays === value,
        as: "button",
        type: "button",
        key: value,
        onClick: function onClick() {
          return _onClick(value);
        },
        onBlur: function onBlur(e) {
          return _onBlur(e, menuContext.setOpen);
        },
        className: gatStyles.expirationDaysEntry,
        role: "menuitemradio"
      }, /*#__PURE__*/React.createElement("span", {
        className: gatStyles.expirationDaysLabel
      }, label));
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: gatStyles.expirationDaysContainer
  }, /*#__PURE__*/React.createElement(SelectMenu, null, /*#__PURE__*/React.createElement(Button, {
    as: "summary",
    sx: selectMenuButtonStyleOverrides,
    "aria-labelledby": outerLabelId,
    "aria-invalid": isInvalid,
    "aria-haspopup": "menu",
    className: gatStyles.expirationDaysButton,
    "aria-controls": menuId,
    "aria-label": "".concat(label, " : ").concat(expirationOptions[selectedExpirationDays])
  }, expirationOptions[selectedExpirationDays], ' ', /*#__PURE__*/React.createElement("span", {
    className: 'ml2'
  }, /*#__PURE__*/React.createElement(DropdownIcon, null))), /*#__PURE__*/React.createElement(SelectModal, null)));
}
module.exports = connect()(withThemeProvider(ExpirationDaysInput));
  let __hot__
  
  __registry__.register('tokens/gat/expiration-days-input', module.exports, __hot__)
  