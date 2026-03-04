
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var React = require('react');
var connect = require('../../../components/connect');
var _require = require('./constants'),
  PERMISSION_NO_ACCESS = _require.PERMISSION_NO_ACCESS,
  ORGS_PERMISSION = _require.ORGS_PERMISSION,
  ORGS = _require.ORGS,
  SELECTED_ORGS = _require.SELECTED_ORGS;
var OrganizationsInput = require('./organizations-input');
var PermissionsInput = require('./permissions-input');
var formStyles = require('../../../../shared/styles/forms.css');
var SectionHeading = require('./section-heading');
function OrgsSection(props) {
  var _formData$formId;
  var _React$useState = React.useState(PERMISSION_NO_ACCESS),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    permission = _React$useState2[0],
    setPermission = _React$useState2[1];
  function onPermissionSelect(permission) {
    setPermission(permission);
    props.onInputChange(ORGS_PERMISSION, permission);
    // Reset orgs selection if no access is selected
    if (permission === PERMISSION_NO_ACCESS) {
      props.dispatch({
        type: 'FORM_CHANGE',
        formId: props.formId,
        name: SELECTED_ORGS,
        value: []
      });
    }
  }
  var formId = props.formId,
    formData = props.formData,
    allOrgs = props.allOrgs,
    onInputChange = props.onInputChange;
  var sectionId = "".concat(formId, "_organizations_section");
  var errorMessageId = "".concat(sectionId, "_error_message");
  var errorMessage = (_formData$formId = formData[formId]) === null || _formData$formId === void 0 || (_formData$formId = _formData$formId[ORGS_PERMISSION]) === null || _formData$formId === void 0 ? void 0 : _formData$formId.errorMessage;
  return /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Organizations",
    id: sectionId
  }, /*#__PURE__*/React.createElement(PermissionsInput, {
    formId: formId,
    name: ORGS_PERMISSION,
    onSelect: onPermissionSelect,
    outerLabelId: sectionId,
    isInvalid: !!errorMessage,
    ariaDescribedby: errorMessageId
  }), permission !== PERMISSION_NO_ACCESS && /*#__PURE__*/React.createElement(OrganizationsInput, {
    formId: formId,
    formData: formData,
    name: ORGS,
    allOrgs: allOrgs,
    onInputChange: onInputChange
  }), /*#__PURE__*/React.createElement("p", {
    id: errorMessageId,
    className: formStyles.errorMessage
  }, errorMessage));
}
module.exports = connect()(OrgsSection);
  let __hot__
  
  __registry__.register('tokens/gat/organizations-section', module.exports, __hot__)
  