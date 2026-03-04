
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.object.to-string.js");
var React = require('react');
var gatStyles = require('../gat.css');
var _require = require('@primer/octicons-react'),
  XIcon = _require.XIcon;
function SelectedItems(props) {
  var itemGroups = props.itemGroups;
  return /*#__PURE__*/React.createElement("div", {
    className: gatStyles.selectedItemsContainer
  }, itemGroups.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: gatStyles.selectedItemsInnerContainer
  }, itemGroups.map(function (_ref) {
    var label = _ref.label,
      _onClick = _ref.onClick,
      items = _ref.items,
      refLabel = _ref.refLabel;
    return items.length > 0 && /*#__PURE__*/React.createElement("div", {
      key: label
    }, /*#__PURE__*/React.createElement("div", {
      className: gatStyles.selectedItemsGroupTitleContainer
    }, /*#__PURE__*/React.createElement("label", {
      ref: refLabel,
      tabIndex: -1,
      className: gatStyles.selectedItemsGroupTitle
    }, label)), items.map(function (item, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "".concat(label, "_").concat(item),
        className: index % 2 === 0 ? "".concat(gatStyles.selectedItemAtEvenPositionContainer) : "".concat(gatStyles.selectedItemAtOddPositionContainer)
      }, /*#__PURE__*/React.createElement("label", {
        className: gatStyles.selectedItemLabel
      }, item), _onClick && /*#__PURE__*/React.createElement("button", {
        type: "button",
        "aria-label": "Cancel",
        onClick: function onClick() {
          _onClick(item);
        },
        className: gatStyles.btnSelectedItemDeselect
      }, /*#__PURE__*/React.createElement(XIcon, null)));
    }));
  })));
}
module.exports = SelectedItems;
  let __hot__
  
  __registry__.register('tokens/gat/selected-items', module.exports, __hot__)
  