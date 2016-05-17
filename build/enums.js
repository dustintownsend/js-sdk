'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Enum for Mobile Identity Connect authorization grants.
 */
var AuthorizationGrant = {
  AuthorizationCodeLoginPage: 'AuthorizationCodeLoginPage',
  AuthorizationCodeAPI: 'AuthorizationCodeAPI'
};
Object.freeze(AuthorizationGrant);
exports.AuthorizationGrant = AuthorizationGrant;


var AuthType = {
  All: 'All',
  App: 'App',
  Basic: 'Basic',
  Default: 'Default',
  Master: 'Master',
  None: 'None',
  Session: 'Session'
};
Object.freeze(AuthType);
exports.AuthType = AuthType;

/**
 * Enum for DataStore types.
 */

var DataStoreType = {
  Sync: 'Sync',
  Cache: 'Cache',
  Network: 'Network',
  User: 'User',
  File: 'File'
};
Object.freeze(DataStoreType);
exports.DataStoreType = DataStoreType;

/**
 * @private
 * Enum for Http Methods.
 */

var RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
Object.freeze(RequestMethod);
exports.RequestMethod = RequestMethod;

/**
 * Enum for Social Identities.
 */

var SocialIdentity = {
  Facebook: 'facebook',
  Google: 'google',
  LinkedIn: 'linkedin'
};
Object.freeze(SocialIdentity);
exports.SocialIdentity = SocialIdentity;

/**
 * @provate
 * Enum for Status Codes.
 */

var StatusCode = {
  Ok: 200,
  Created: 201,
  RedirectTemporarily: 301,
  RedirectPermanetly: 302,
  NotFound: 404,
  ServerError: 500
};
Object.freeze(StatusCode);
exports.StatusCode = StatusCode;