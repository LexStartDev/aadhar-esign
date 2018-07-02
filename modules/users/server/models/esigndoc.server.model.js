'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
 

/**
 * User Schema
 */

var EsignDocSchema = new Schema({

  name: {
    type: String
  },
  email: {
    type: String
  },
  signUrl: {
    type: String,

  },
  signed: {
    type: String,
  },
  rejected: {
    type: String,
  },
  revoked: {
    type: String,
  }

});

var EsignCreditSchema = new Schema({
  accountId:{
    type:Number
  },
  org_id: {
    type: Number
  },

  creditsPurchased: {
    type: Number
  },

  amountPaid: {
    type: Number
  },

  purchasedOn: {
    type: Date,
    default: Date.now
  }

});


mongoose.model('EsignDoc', EsignDocSchema);
mongoose.model('EsignCredit', EsignCreditSchema);

