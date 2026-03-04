
  const __registry__ = require('../../../../spiferack/client/index.js')
  'use strict';

module.exports = {
  // Form name
  FORM_ID: 'create-gat',
  // General section
  TOKEN_NAME: 'tokenName',
  TOKEN_DESCRIPTION: 'tokenDescription',
  EXPIRATION_DAYS: 'expirationDays',
  ALLOWED_IP_RANGES: 'allowedIPRanges',
  MAX_TOKEN_NAME_LEN: 40,
  MAX_TOKEN_DESCRIPTION_LEN: 120,
  // Packages and scopes section
  PACKAGES_AND_SCOPES: 'packagesAndScopes',
  PACKAGES_AND_SCOPES_PERMISSION: 'packagesAndScopesPermission',
  SELECTED_PACKAGES_AND_SCOPES: 'selectedPackagesAndScopes',
  SELECTED_PACKAGES_AND_SCOPES_ALL: 'packagesAll',
  SELECTED_PACKAGES_AND_SCOPES_SOME: 'packagesAndScopesSome',
  ALL_SCOPES: 'allScopes',
  ALL_PACKAGES: 'allPackages',
  SELECTED_SCOPES: 'selectedScopes',
  SELECTED_PACKAGES: 'selectedPackages',
  MAX_ALLOWED_PACKAGES_SELECTED: 50,
  // Organizations
  ORGS: 'orgs',
  ALL_ORGS: 'allOrgs',
  ORGS_PERMISSION: 'orgsPermission',
  SELECTED_ORGS: 'selectedOrgs',
  SCOPES_SELECTION: 'scopesSelection',
  // Summary section
  TOTAL_SELECTED_SCOPES: 'totalSelectedScopes',
  TOTAL_SELECTED_PACKAGES: 'totalSelectedPackages',
  TOTAL_SELECTED_ORGS: 'totalSelectedOrgs',
  // Error messages
  TOKEN_NAME_ERROR: 'Every token needs a unique name',
  TOKEN_NAME_CONTENT_ERROR: 'Token name can only contain letters, numbers, underscores, dashes, and spaces.',
  TOKEN_NAME_EMPTY_ERROR: 'Token name cannot be empty',
  TOKEN_NAME_TOO_LONG_ERROR: 'Token name is too long (maximum is 40 characters)',
  TOKEN_DESCRIPTION_TOO_LONG_ERROR: 'Token description is too long (maximum is 120 characters)',
  TOKEN_DESCRIPTION_CONTENT_ERROR: 'Token description can only contain letters, numbers, underscores, dashes, and spaces.',
  EXPIRATION_ERROR: 'Invalid expiration value. Must be at least one day in the future.',
  EXPIRATION_READ_WRITE_ERROR: 'Invalid expiration value. Read-write tokens can only be valid for up to 90 days.',
  IP_RANGES_ERROR: 'One or more fields contains an invalid CIDR entry.',
  ADD_IP_RANGES_ERROR: 'Please provide an IP address range before adding a new one.',
  TOKEN_GEN_FAILED_ERROR: 'Token generation failed. Please review any errors and try again.',
  SCOPES_SELECTION_ERROR: 'You must give this token access to at least one package, scope, or organization.',
  NO_ORGS_SELECTED_ERROR: 'You must select at least one organization if granting organization permissions to this token.',
  NO_PACKAGES_SELECTED_ERROR: 'You must select at least one package or scope.',
  PACKAGE_AND_SCOPES_NO_ACCESS_ERROR: 'Please select at least one: package, scope here or organization below.',
  ORGS_NO_ACCESS_ERROR: 'Please select at least one: organization here or package, scope above.',
  // Expiration
  EXPIRATION_DATE_INPUT: 'expirationDateInput',
  EXPIRATION_OPTIONS: {
    7: '7 days',
    30: '30 days',
    60: '60 days',
    90: '90 days',
    '': 'Custom...'
  },
  EXPIRATION_OPTIONS_READ_WRITE: {
    7: '7 days',
    30: '30 days',
    60: '60 days',
    90: '90 days',
    '': 'Custom...'
  },
  // Permissions
  PERMISSION_NO_ACCESS: 'No access',
  PERMISSION_READ_ONLY: 'Read only',
  PERMISSION_READ_WRITE: 'Read and write',
  // Links
  LINK_ABOUT_ACCESS_TOKENS: 'https://docs.npmjs.com/about-access-tokens#about-granular-access-tokens',
  LINK_CREATE_GAT_DOCS: 'https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-granular-access-tokens-on-the-website',
  LINK_CIDR_NOTATION: 'https://docs.npmjs.com/creating-and-viewing-access-tokens/#cidr-restricted-token-errors',
  // Gat banner
  GAT_BANNER_ID: 'gat-banner'
};
  let __hot__
  
  __registry__.register('tokens/gat/constants', module.exports, __hot__)
  