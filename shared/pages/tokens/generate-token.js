
  const __registry__ = require('../../../spiferack/client/index.js')
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.string.includes.js");
var React = require('react');
var _require = require('@primer/react'),
  Dropdown = _require.Dropdown,
  useDetails = _require.useDetails;
var Link = require('@npm/spiferack/link');
var DropdownStyle = require('./list.css');
var forms = require('../../styles/forms.css');
var GenerateTokenButton = function GenerateTokenButton(props) {
  var createGATURL = props.createGATURL,
    createURL = props.createURL;
  var buttonStyleOverrides = {
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem'
  };
  var menuModalStyleOverrides = {
    backgroundColor: '#fff',
    border: '1px solid #E6E6E6',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.12)',
    margin: 0,
    width: 'auto'
  };
  var menuItemStyleOverrides = {
    padding: '0.1rem 0.5rem'
  };

  // If createURL is not provided (feature flag ON), show simple button
  if (!createURL) {
    return /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
      href: createGATURL,
      className: forms.buttonGradientGreen
    }, "Generate New Token"));
  }

  // If createURL is provided (feature flag OFF), show dropdown with both options
  var _useDetails = useDetails({}),
    setOpen = _useDetails.setOpen,
    getDetailsProps = _useDetails.getDetailsProps;
  var onKeyDown = function onKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };
  var onBlur = function onBlur(e) {
    if (!e.relatedTarget || !e.relatedTarget.className.includes(DropdownStyle.createTokenDropdownLink)) {
      setOpen(false);
    }
  };
  return /*#__PURE__*/React.createElement(Dropdown, _extends({
    onKeyDown: onKeyDown
  }, getDetailsProps()), /*#__PURE__*/React.createElement(Dropdown.Button, {
    as: "summary",
    sx: buttonStyleOverrides,
    className: "".concat(DropdownStyle.createTokenDropdownButton)
  }, "Generate New Token"), /*#__PURE__*/React.createElement(Dropdown.Menu, {
    onBlur: onBlur,
    direction: "se",
    sx: menuModalStyleOverrides,
    className: "".concat(DropdownStyle.createTokenDropdownMenu)
  }, /*#__PURE__*/React.createElement(Dropdown.Item, {
    sx: menuItemStyleOverrides
  }, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
    className: DropdownStyle.createTokenDropdownLink,
    href: createGATURL
  }, "Granular Access Token"))), /*#__PURE__*/React.createElement(Dropdown.Item, {
    sx: menuItemStyleOverrides
  }, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
    className: DropdownStyle.createTokenDropdownLink,
    href: createURL
  }, "Classic Token")))));
};
module.exports = GenerateTokenButton;
  let __hot__
  
  __registry__.register('tokens/generate-token', module.exports, __hot__)
  