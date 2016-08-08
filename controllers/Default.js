'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.pdiVerificationAccountsGET = function pdiVerificationAccountsGET (req, res, next) {
  Default.pdiVerificationAccountsGET(req.swagger.params, res, next);
};
