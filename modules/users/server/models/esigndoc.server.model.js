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
    type: String,
    default: ''
  },
  email: {
    type: String
  },
  signurl: {
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



mongoose.model('EsignDoc', EsignDocSchema);
