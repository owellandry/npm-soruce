
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

require("core-js/modules/es.array.concat.js");
var React = require('react');
var gatStyles = require('../gat.css');
function Divider(props) {
  var classNames = props.classNames;
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(gatStyles.divider, " ").concat(classNames)
  });
}
module.exports = Divider;
  let __hot__
  
  __registry__.register('tokens/gat/divider', module.exports, __hot__)
  