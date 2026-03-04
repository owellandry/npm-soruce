
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/web.dom-collections.iterator.js");
var isCidr4 = require('is-cidr').v4;
var moment = require('moment');
var _require = require('./constants'),
  TOKEN_NAME = _require.TOKEN_NAME,
  EXPIRATION_DAYS = _require.EXPIRATION_DAYS,
  EXPIRATION_ERROR = _require.EXPIRATION_ERROR,
  EXPIRATION_READ_WRITE_ERROR = _require.EXPIRATION_READ_WRITE_ERROR,
  ALLOWED_IP_RANGES = _require.ALLOWED_IP_RANGES,
  IP_RANGES_ERROR = _require.IP_RANGES_ERROR,
  PERMISSION_NO_ACCESS = _require.PERMISSION_NO_ACCESS,
  PERMISSION_READ_ONLY = _require.PERMISSION_READ_ONLY,
  PERMISSION_READ_WRITE = _require.PERMISSION_READ_WRITE,
  SELECTED_PACKAGES_AND_SCOPES_ALL = _require.SELECTED_PACKAGES_AND_SCOPES_ALL,
  TOKEN_DESCRIPTION = _require.TOKEN_DESCRIPTION,
  TOKEN_NAME_TOO_LONG_ERROR = _require.TOKEN_NAME_TOO_LONG_ERROR,
  TOKEN_DESCRIPTION_TOO_LONG_ERROR = _require.TOKEN_DESCRIPTION_TOO_LONG_ERROR,
  TOKEN_NAME_EMPTY_ERROR = _require.TOKEN_NAME_EMPTY_ERROR,
  MAX_TOKEN_NAME_LEN = _require.MAX_TOKEN_NAME_LEN,
  MAX_TOKEN_DESCRIPTION_LEN = _require.MAX_TOKEN_DESCRIPTION_LEN,
  PACKAGES_AND_SCOPES_PERMISSION = _require.PACKAGES_AND_SCOPES_PERMISSION,
  ORGS_PERMISSION = _require.ORGS_PERMISSION,
  SELECTED_PACKAGES = _require.SELECTED_PACKAGES,
  SELECTED_SCOPES = _require.SELECTED_SCOPES,
  SELECTED_ORGS = _require.SELECTED_ORGS,
  SELECTED_PACKAGES_AND_SCOPES = _require.SELECTED_PACKAGES_AND_SCOPES,
  NO_PACKAGES_SELECTED_ERROR = _require.NO_PACKAGES_SELECTED_ERROR,
  NO_ORGS_SELECTED_ERROR = _require.NO_ORGS_SELECTED_ERROR,
  PACKAGES_AND_SCOPES = _require.PACKAGES_AND_SCOPES,
  ORGS = _require.ORGS,
  PACKAGE_AND_SCOPES_NO_ACCESS_ERROR = _require.PACKAGE_AND_SCOPES_NO_ACCESS_ERROR,
  ORGS_NO_ACCESS_ERROR = _require.ORGS_NO_ACCESS_ERROR;
var validators = function validators() {
  var featureFlagEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, TOKEN_NAME, function (formValues) {
    var _formValues$TOKEN_NAM, _formValues$TOKEN_NAM2;
    var tokenName = (_formValues$TOKEN_NAM = (_formValues$TOKEN_NAM2 = formValues[TOKEN_NAME]) === null || _formValues$TOKEN_NAM2 === void 0 ? void 0 : _formValues$TOKEN_NAM2.value) !== null && _formValues$TOKEN_NAM !== void 0 ? _formValues$TOKEN_NAM : '';
    tokenName = tokenName.trim();
    if (tokenName.length === 0) {
      return {
        error: TOKEN_NAME_EMPTY_ERROR
      };
    }
    if (tokenName.length > MAX_TOKEN_NAME_LEN) {
      return {
        error: TOKEN_NAME_TOO_LONG_ERROR
      };
    }
    return {};
  }), TOKEN_DESCRIPTION, function (formValues) {
    var _formValues$TOKEN_DES, _formValues$TOKEN_DES2;
    var tokenDescription = (_formValues$TOKEN_DES = (_formValues$TOKEN_DES2 = formValues[TOKEN_DESCRIPTION]) === null || _formValues$TOKEN_DES2 === void 0 ? void 0 : _formValues$TOKEN_DES2.value) !== null && _formValues$TOKEN_DES !== void 0 ? _formValues$TOKEN_DES : '';
    tokenDescription = tokenDescription.trim();
    if (tokenDescription.length === 0) {
      return {};
    }
    if (tokenDescription.length > MAX_TOKEN_DESCRIPTION_LEN) {
      return {
        error: TOKEN_DESCRIPTION_TOO_LONG_ERROR
      };
    }
    return {};
  }), EXPIRATION_DAYS, function (formValues) {
    var field = formValues[EXPIRATION_DAYS];
    if (!field || !field.value) {
      return {
        error: EXPIRATION_ERROR
      };
    }
    var numDays = Number(field.value);
    if (isNaN(numDays) || numDays < 1) {
      return {
        error: EXPIRATION_ERROR
      };
    }

    // Apply 90-day limit for read-write tokens only when feature flag is enabled
    if (featureFlagEnabled && numDays > 90) {
      var _formValues$PACKAGES_, _formValues$ORGS_PERM;
      var packagesPermission = (_formValues$PACKAGES_ = formValues[PACKAGES_AND_SCOPES_PERMISSION]) === null || _formValues$PACKAGES_ === void 0 ? void 0 : _formValues$PACKAGES_.value;
      var orgsPermission = (_formValues$ORGS_PERM = formValues[ORGS_PERMISSION]) === null || _formValues$ORGS_PERM === void 0 ? void 0 : _formValues$ORGS_PERM.value;
      var isReadWriteToken = packagesPermission === PERMISSION_READ_WRITE || orgsPermission === PERMISSION_READ_WRITE;
      if (isReadWriteToken) {
        return {
          error: EXPIRATION_READ_WRITE_ERROR
        };
      }
    }
    return {};
  }), ALLOWED_IP_RANGES, function (formValues) {
    var _formValues$ALLOWED_I, _formValues$ALLOWED_I2;
    var allowedIPRanges = (_formValues$ALLOWED_I = (_formValues$ALLOWED_I2 = formValues[ALLOWED_IP_RANGES]) === null || _formValues$ALLOWED_I2 === void 0 ? void 0 : _formValues$ALLOWED_I2.value) !== null && _formValues$ALLOWED_I !== void 0 ? _formValues$ALLOWED_I : [];
    var valid = true;
    for (var i = 0; i < allowedIPRanges.length; i++) {
      if (allowedIPRanges[i] === '' || allowedIPRanges[i] === undefined) {
        continue;
      }
      if (!isCidr4(allowedIPRanges[i])) {
        valid = false;
        break;
      }
    }
    if (!valid) {
      return {
        error: IP_RANGES_ERROR
      };
    }
    return {};
  }), PACKAGES_AND_SCOPES, function (formValues) {
    var _formValues$PACKAGES_2, _formValues$PACKAGES_3, _formValues$SELECTED_, _formValues$SELECTED_2, _formValues$SELECTED_3, _formValues$SELECTED_4, _formValues$SELECTED_5, _formValues$SELECTED_6;
    var permission = (_formValues$PACKAGES_2 = (_formValues$PACKAGES_3 = formValues[PACKAGES_AND_SCOPES_PERMISSION]) === null || _formValues$PACKAGES_3 === void 0 ? void 0 : _formValues$PACKAGES_3.value) !== null && _formValues$PACKAGES_2 !== void 0 ? _formValues$PACKAGES_2 : PERMISSION_NO_ACCESS;
    var selectedPkgsAndScopes = (_formValues$SELECTED_ = (_formValues$SELECTED_2 = formValues[SELECTED_PACKAGES_AND_SCOPES]) === null || _formValues$SELECTED_2 === void 0 ? void 0 : _formValues$SELECTED_2.value) !== null && _formValues$SELECTED_ !== void 0 ? _formValues$SELECTED_ : '';
    var selectedScopes = (_formValues$SELECTED_3 = (_formValues$SELECTED_4 = formValues[SELECTED_SCOPES]) === null || _formValues$SELECTED_4 === void 0 ? void 0 : _formValues$SELECTED_4.value) !== null && _formValues$SELECTED_3 !== void 0 ? _formValues$SELECTED_3 : [];
    var selectedPkgs = (_formValues$SELECTED_5 = (_formValues$SELECTED_6 = formValues[SELECTED_PACKAGES]) === null || _formValues$SELECTED_6 === void 0 ? void 0 : _formValues$SELECTED_6.value) !== null && _formValues$SELECTED_5 !== void 0 ? _formValues$SELECTED_5 : [];
    if (permission !== PERMISSION_NO_ACCESS && selectedPkgsAndScopes !== SELECTED_PACKAGES_AND_SCOPES_ALL && selectedScopes.length === 0 && selectedPkgs.length === 0) {
      return {
        error: NO_PACKAGES_SELECTED_ERROR
      };
    }
    return {};
  }), ORGS, function (formValues) {
    var _formValues$ORGS_PERM2, _formValues$ORGS_PERM3, _formValues$SELECTED_7, _formValues$SELECTED_8;
    var permission = (_formValues$ORGS_PERM2 = (_formValues$ORGS_PERM3 = formValues[ORGS_PERMISSION]) === null || _formValues$ORGS_PERM3 === void 0 ? void 0 : _formValues$ORGS_PERM3.value) !== null && _formValues$ORGS_PERM2 !== void 0 ? _formValues$ORGS_PERM2 : PERMISSION_NO_ACCESS;
    var selectedOrgs = (_formValues$SELECTED_7 = (_formValues$SELECTED_8 = formValues[SELECTED_ORGS]) === null || _formValues$SELECTED_8 === void 0 ? void 0 : _formValues$SELECTED_8.value) !== null && _formValues$SELECTED_7 !== void 0 ? _formValues$SELECTED_7 : [];
    if (permission !== PERMISSION_NO_ACCESS && selectedOrgs.length === 0) {
      return {
        error: NO_ORGS_SELECTED_ERROR
      };
    }
    return {};
  }), PACKAGES_AND_SCOPES_PERMISSION, function (formValues) {
    var _formValues$PACKAGES_4, _formValues$PACKAGES_5, _formValues$ORGS_PERM4, _formValues$ORGS_PERM5;
    if (((_formValues$PACKAGES_4 = (_formValues$PACKAGES_5 = formValues[PACKAGES_AND_SCOPES_PERMISSION]) === null || _formValues$PACKAGES_5 === void 0 ? void 0 : _formValues$PACKAGES_5.value) !== null && _formValues$PACKAGES_4 !== void 0 ? _formValues$PACKAGES_4 : PERMISSION_NO_ACCESS) === PERMISSION_NO_ACCESS && ((_formValues$ORGS_PERM4 = (_formValues$ORGS_PERM5 = formValues[ORGS_PERMISSION]) === null || _formValues$ORGS_PERM5 === void 0 ? void 0 : _formValues$ORGS_PERM5.value) !== null && _formValues$ORGS_PERM4 !== void 0 ? _formValues$ORGS_PERM4 : PERMISSION_NO_ACCESS) === PERMISSION_NO_ACCESS) {
      return {
        error: PACKAGE_AND_SCOPES_NO_ACCESS_ERROR
      };
    }
    return {};
  }), ORGS_PERMISSION, function (formValues) {
    var _formValues$PACKAGES_6, _formValues$PACKAGES_7, _formValues$ORGS_PERM6, _formValues$ORGS_PERM7;
    if (((_formValues$PACKAGES_6 = (_formValues$PACKAGES_7 = formValues[PACKAGES_AND_SCOPES_PERMISSION]) === null || _formValues$PACKAGES_7 === void 0 ? void 0 : _formValues$PACKAGES_7.value) !== null && _formValues$PACKAGES_6 !== void 0 ? _formValues$PACKAGES_6 : PERMISSION_NO_ACCESS) === PERMISSION_NO_ACCESS && ((_formValues$ORGS_PERM6 = (_formValues$ORGS_PERM7 = formValues[ORGS_PERMISSION]) === null || _formValues$ORGS_PERM7 === void 0 ? void 0 : _formValues$ORGS_PERM7.value) !== null && _formValues$ORGS_PERM6 !== void 0 ? _formValues$ORGS_PERM6 : PERMISSION_NO_ACCESS) === PERMISSION_NO_ACCESS) {
      return {
        error: ORGS_NO_ACCESS_ERROR
      };
    }
    return {};
  });
};
function permissionPhrase(permission) {
  switch (permission) {
    case PERMISSION_NO_ACCESS:
      return 'no';
    case PERMISSION_READ_ONLY:
      return 'read-only';
    case PERMISSION_READ_WRITE:
      return 'read and write';
    default:
      return 'no';
  }
}

// Works for the words - scope, package, organization.
function pluralize(word, count) {
  return count === 1 ? word : "".concat(word, "s");
}

// Return the date after the `days` days in the format 'Monday, January 1, 2020'.
// startDate is the date to start from, in the format 'YYYY-MM-DD'.
function dateAfterDays(startDate, days) {
  var newDate = moment(startDate, 'YYYY-MM-DD').add(days, 'days');
  return newDate.format('dddd, MMMM D, YYYY');
}

// If permission is No access, count should be empty.
// If all packages/scopes/orgs are selected then all should be the corresponding count phrase.
// Else, the actual count of the items.
function packagesCountPhrase(permission, selectedPackagesAndScopes, selectedCount) {
  if (permission === PERMISSION_NO_ACCESS) {
    return '';
  }
  if (selectedPackagesAndScopes === SELECTED_PACKAGES_AND_SCOPES_ALL) {
    return 'all';
  }
  return selectedCount;
}
function countPhrase(permission, selectedCount) {
  if (permission === PERMISSION_NO_ACCESS) {
    return '';
  }
  return selectedCount;
}
function pkgsAndScopesCountPhrase(pkgsPhrase, scopesPhrase) {
  // Only some scopes selected
  if (pkgsPhrase.startsWith('0') && !scopesPhrase.startsWith('0')) {
    return scopesPhrase;
  }
  // Only some packages selected
  if (!pkgsPhrase.startsWith('0') && scopesPhrase.startsWith('0')) {
    return pkgsPhrase;
  }
  // Either some scopes + packages selected
  // or none selected (which shouldn't happen)
  return pkgsPhrase + ' and ' + scopesPhrase;
}

// Unscoped packages comes first, then scoped packages.
function pkgCompareFn(pkg1, pkg2) {
  if (pkg1.startsWith('@') && !pkg2.startsWith('@')) {
    return 1;
  }
  if (!pkg1.startsWith('@') && pkg2.startsWith('@')) {
    return -1;
  }
  return pkg1.localeCompare(pkg2);
}
function scopeCompareFn(scope1, scope2) {
  return scope1.localeCompare(scope2);
}
function orgCompareFn(org1, org2) {
  return org1.name.localeCompare(org2.name);
}
module.exports = {
  validators: validators,
  permissionPhrase: permissionPhrase,
  pluralize: pluralize,
  dateAfterDays: dateAfterDays,
  packagesCountPhrase: packagesCountPhrase,
  countPhrase: countPhrase,
  pkgsAndScopesCountPhrase: pkgsAndScopesCountPhrase,
  pkgCompareFn: pkgCompareFn,
  scopeCompareFn: scopeCompareFn,
  orgCompareFn: orgCompareFn
};
  let __hot__
  
  __registry__.register('tokens/gat/utils', module.exports, __hot__)
  