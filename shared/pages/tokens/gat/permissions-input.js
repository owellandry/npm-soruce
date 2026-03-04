
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
var _require3 = require('./constants'),
  PERMISSION_NO_ACCESS = _require3.PERMISSION_NO_ACCESS,
  PERMISSION_READ_ONLY = _require3.PERMISSION_READ_ONLY,
  PERMISSION_READ_WRITE = _require3.PERMISSION_READ_WRITE;
var formStyles = require('../../../../shared/styles/forms.css');
var gatStyles = require('../gat.css');
var DropdownIcon = require('../../../components/icons/dropdown-caret');
function PermissionsInput(props) {
  var _React$useState = React.useState(PERMISSION_NO_ACCESS),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    selectedPermission = _React$useState2[0],
    setSelectedPermission = _React$useState2[1];
  var permissions = [PERMISSION_NO_ACCESS, PERMISSION_READ_ONLY, PERMISSION_READ_WRITE];
  var onSelect = props.onSelect,
    formId = props.formId,
    name = props.name,
    outerLabelId = props.outerLabelId,
    isInvalid = props.isInvalid,
    ariaDescribedby = props.ariaDescribedby;
  var labelId = "".concat(formId, "_").concat(name, "_label");
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
  function _onClick(permission) {
    setSelectedPermission(permission);
    onSelect && onSelect(permission);
    props.dispatch({
      type: 'FORM_CHANGE',
      name: name,
      formId: formId,
      value: permission
    });
  }
  function _onBlur(e, setOpen) {
    // If focus moved to something else than a menu item, then close select menu
    if (!e.relatedTarget || !e.relatedTarget.className.includes(gatStyles.permissionEntry)) {
      setOpen(false);
    }
  }
  var SelectModal = function SelectModal() {
    var menuContext = useContext(SelectMenu.MenuContext);
    return /*#__PURE__*/React.createElement(SelectMenu.Modal, {
      className: gatStyles.permissionMenuModal
    }, /*#__PURE__*/React.createElement(SelectMenu.List, {
      className: gatStyles.permissionEntryList
    }, permissions.map(function (permission) {
      return /*#__PURE__*/React.createElement(SelectMenu.Item, {
        selected: selectedPermission === permission,
        "aria-checked": selectedPermission === permission,
        as: "button",
        type: "button",
        key: permission,
        onClick: function onClick() {
          return _onClick(permission);
        },
        onBlur: function onBlur(e) {
          return _onBlur(e, menuContext.setOpen);
        },
        className: gatStyles.permissionEntry,
        role: "menuitemradio"
      }, /*#__PURE__*/React.createElement("span", {
        className: gatStyles.permissionLabel
      }, permission));
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: gatStyles.permissionsContainer
  }, /*#__PURE__*/React.createElement("p", {
    id: labelId,
    className: formStyles.label
  }, "Permissions"), /*#__PURE__*/React.createElement(SelectMenu, null, /*#__PURE__*/React.createElement(Button, {
    as: "summary",
    sx: selectMenuButtonStyleOverrides,
    "aria-labelledby": outerLabelId ? "".concat(outerLabelId, " ").concat(labelId) : labelId,
    "aria-invalid": isInvalid,
    "aria-haspopup": "menu",
    className: gatStyles.permissionsButton
  }, selectedPermission, ' ', /*#__PURE__*/React.createElement("span", {
    className: 'ml2'
  }, /*#__PURE__*/React.createElement(DropdownIcon, null))), /*#__PURE__*/React.createElement(SelectModal, null)));
}
module.exports = connect()(withThemeProvider(PermissionsInput));
  let __hot__
  
  __registry__.register('tokens/gat/permissions-input', module.exports, __hot__)
  