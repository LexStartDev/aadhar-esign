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
  },
  filePath: {
    type: String,
  }, 
  created: {
    type: Date,
    default: Date.now
  }

});

var EsignCreditSchema = new Schema({
  accountId:{
    type:String
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

var EsignCreditUsageSchema = new Schema({
  accountId: {
    type: String
  },
  org_id: {
    type: Number
  },
  creditsUsed: {
    type: Number
  },
  usedOn: {
    type: Date,
    default: Date.now
  }
});



mongoose.model('EsignDoc', EsignDocSchema);
mongoose.model('EsignCredit', EsignCreditSchema);
mongoose.model('EsignCreditUsage', EsignCreditUsageSchema);

