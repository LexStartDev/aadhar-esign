'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/esigndoc').post(users.eSignDoc);
  app.route('/api/esigndocupdate').post(users.updateEsignDocList);
  app.route('/api/getEsignDocByEmail').get(users.getEsignDocList);
  app.route('/api/webhook').post(users.eSignDocwebhook);
  app.route('/api/eSigncredits').post(users.eSigncredits);
  app.route('/api/eSigncreditsUsage').post(users.eSigncreditsUsage);
  app.route('/api/eSignRecordsListUsed').post(users.eSignRecordsListUsed);
  app.route('/api/eSignRecordsListPaid').post(users.eSignRecordsListPaid);




  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};


