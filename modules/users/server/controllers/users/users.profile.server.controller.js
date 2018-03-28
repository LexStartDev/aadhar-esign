'use strict';

/**
 * Module dependencies.
 */
//   var fs = require('fs');

//   fs.readFile('req.files.file', function (err, data) {
//     console.log("rahul");
//   if (err) throw err;
//   console.log("this is data of the file acquired !")
//   console.log(typeof data); //OBJECT
//   const pdf = data.toString('base64'); //PDF WORKS
// });
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  EsignDoc = mongoose.model('EsignDoc');
var path = require('path');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture   
 */
exports.eSignDoc = function (req, res) {
  var invitee_temp = JSON.parse(req.body.invitee);
  var filedata = req.files.file.data;
  var request = require("request");
  var filename = req.files.file.name;
  //var name = req.user.firstName;
  //var email = req.user.email;
  console.log("Length is  : ---- " + invitee_temp.length);


  switch (invitee_temp.length) {

    case 1:
      console.log("rahul");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "redirectUrl": "http://dev.lexstart.in:3000/api/v2/esigncomplete"
          }
      };
      break;

    case 2:
      console.log("rahul2");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "redirectUrl": "http://dev.lexstart.in:3000/api/v2/esigncomplete"

          }
      };
      break;

    case 3:
      console.log("rahul3");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };
      break;

    case 4:
      console.log("rahul4");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;

    case 5:
      console.log("rahul5");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;

    case 6:
      console.log("rahul6");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "invitees[5].name": invitee_temp[5].name,
            "invitees[5].email": invitee_temp[5].email,
            "invitees[5].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;

    case 7:
      console.log("rahul6");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "invitees[5].name": invitee_temp[5].name,
            "invitees[5].email": invitee_temp[5].email,
            "invitees[5].emailNotification": "false",
            "invitees[6].name": invitee_temp[6].name,
            "invitees[6].email": invitee_temp[6].email,
            "invitees[6].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;

    case 8:
      console.log("rahul8");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "invitees[5].name": invitee_temp[5].name,
            "invitees[5].email": invitee_temp[5].email,
            "invitees[5].emailNotification": "false",
            "invitees[6].name": invitee_temp[6].name,
            "invitees[6].email": invitee_temp[6].email,
            "invitees[6].emailNotification": "false",
            "invitees[7].name": invitee_temp[7].name,
            "invitees[7].email": invitee_temp[7].email,
            "invitees[7].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;

    case 9:
      console.log("rahul9");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "invitees[5].name": invitee_temp[5].name,
            "invitees[5].email": invitee_temp[5].email,
            "invitees[5].emailNotification": "false",
            "invitees[6].name": invitee_temp[6].name,
            "invitees[6].email": invitee_temp[6].email,
            "invitees[6].emailNotification": "false",
            "invitees[7].name": invitee_temp[7].name,
            "invitees[7].email": invitee_temp[7].email,
            "invitees[7].emailNotification": "false",
            "invitees[8].name": invitee_temp[8].name,
            "invitees[8].email": invitee_temp[8].email,
            "invitees[8].emailNotification": "fasle",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;
    case 10:
      console.log("rahul10");
      var options = {
        method: 'POST',
        url: 'https://app.leegality.com/api/v1.0/sr/create',
        headers:
          {
            'Postman-Token': '9061024c-ba28-40ff-ad90-5d3beb789ffe',
            'Cache-Control': 'no-cache',
            'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
            Accept: 'application/json',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        formData:
          {
            'files[0].file':
              {
                value: filedata,
                options:
                  {
                    filename: filename,
                    contentType: null
                  }
              },
            "invitees[0].name": invitee_temp[0].name,
            "invitees[0].email": invitee_temp[0].email,
            "invitees[0].emailNotification": "false",
            "invitees[1].name": invitee_temp[1].name,
            "invitees[1].email": invitee_temp[1].email,
            "invitees[1].emailNotification": "false",
            "invitees[2].name": invitee_temp[2].name,
            "invitees[2].email": invitee_temp[2].email,
            "invitees[2].emailNotification": "false",
            "invitees[3].name": invitee_temp[3].name,
            "invitees[3].email": invitee_temp[3].email,
            "invitees[3].emailNotification": "false",
            "invitees[4].name": invitee_temp[4].name,
            "invitees[4].email": invitee_temp[4].email,
            "invitees[4].emailNotification": "false",
            "invitees[5].name": invitee_temp[5].name,
            "invitees[5].email": invitee_temp[5].email,
            "invitees[5].emailNotification": "false",
            "invitees[6].name": invitee_temp[6].name,
            "invitees[6].email": invitee_temp[6].email,
            "invitees[6].emailNotification": "false",
            "invitees[7].name": invitee_temp[7].name,
            "invitees[7].email": invitee_temp[7].email,
            "invitees[7].emailNotification": "false",
            "invitees[8].name": invitee_temp[8].name,
            "invitees[8].email": invitee_temp[8].email,
            "invitees[8].emailNotification": "false",
            "invitees[9].name": invitee_temp[9].name,
            "invitees[9].email": invitee_temp[9].email,
            "invitees[9].emailNotification": "false",
            "redirectUrl": "http://lexstart.in/esigncomplete/success.html"

          }
      };

      break;



    default:

      console.log("PROBLEM IN INVITEES-LENGTH");
  }
  console.log(options);
  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    } else {
      var signRequest = body.data.requests;
      console.log(body);
      for(var i = 0 ; i < signRequest.length ; i++) {
        var newEsignDoc = new EsignDoc({ "name":signRequest[i].name, "email" : signRequest[i].email ,
                  "signurl": signRequest[i].signurl , "signed":signRequest[i].signed,"rejected":signRequest[i].rejected,"revoked":signRequest[i].revoked });
        newEsignDoc.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            //Write code to send emails to the invitees.
            return res.status(200).send(body);
          }
        });
      }
     
    
    }
  });

};




// exports.eSignDoc = function (req, res) {
//   //var fs = require("fs");
//   var unirest = require("unirest");
//   var name = req.user.firstName;
//   var mail = req.user.email;
//   var filesign = req.files.file;
//   var unirequest = unirest("POST", "https://app.leegality.com/api/v1.0/sr/create");

//   unirequest.headers({
//     "Postman-Token": "35162192-148d-4254-8991-1073c5a8b2c3",
//     "Cache-Control": "no-cache",
//     "X-Auth-Token": "OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355",
//     "Accept": "application/json",
//     "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
//   });

//   unirequest.multipart([
//     {
//       "body": filesign
//     },
//     {
//       "body": name
//     },
//     {
//       "body": mail
//     },
//     {
//       "body": "true"
//     }
//   ]);

//   unirequest.end(function (res) {
//     if (res.error) throw new Error(res.error);

//     console.log(res.body);
//   });


// };


// ---------OLD ----------//
//   exports.eSignDoc = function (req, res) {
//     console.log("Hello lexie!");
//     console.log("The File Name is : - " +req.files.file.name);
//     console.log("The user is : " + req.user.firstName+ " " + req.user.lastName);
//     console.log("The Mail id is : " + req.user.email);
//     //console.log("The data in buffer  is : " + req.files.file.data);
//     var pdf = req.files.file;

//     var unirest = require("unirest");

//     var unireq = unirest("POST", "https://app.leegality.com/api/v1.0/sr/create");
//       unireq.headers({

//         "X-Auth-Token": "OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355",
//          "content-type": "application/x-www-form-urlencoded"

// });
// unireq.form({

//   "files" : [{
//      "file" : pdf
//    }],
//    "invitees": [{
//      "name": req.user.firstName,
//      "email": req.user.email,
//      "emailNotification": true
//    }],
//    "message": "Hi, Please sign this document to complete the onboarding process.Thanks, LexStart Team",
//    "requestSignOrder": "true",
//    "deleteOnComplete": "true"
// });
// unireq.end(function (uniresponse) {

//   if (uniresponse.error) throw new Error(uniresponse.error);

//   console.log("The result is : " + JSON.stringify(uniresponse.body));

// });

//  };

// -----------******************END *********************---------//

// console.log(req);
// console.log(req.user);
// var upload = multer(config.uploads.eDocUpload).single('testdoc');
// var docUploadFileFilter = require(path.resolve('./config/lib/multer')).docUploadFileFilter;
// upload.fileFilter = docUploadFileFilter;
//     console.log("inside esign doc");
//   var request = require("request");
//   console.log("The requested body is :" + req);
//   var fileData = req;
//   console.log(fileData + "the file data");

//   var loggedInUser = req.user;
//    var requestedObject = {
//         "headers": {
//    'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355' },
//      "files": [{ "file": req.files.file.data }],
//      "invitees": [{ "name": req.user.firstName, "email": req.user.email , "emailNotification": true }],
//    "message" : "Hi, Please sign this document to complete the onboarding process.Thanks, LexStart Team",
//    "requestSignOrder": "true",
//    "deleteOnComplete" : "true"
//    };

//  request.post('https://app.leegality.com/api/v1.0/sr/create',requestedObject, function(error, response, body){
//    if (!error) {
//   console.log("inside result");// if(response.statusCode == 201 || response.statusCode == 200) {
//      console.log("the response is : " + body);

//   return res.status(200).json({ status: 'success', payment_response: body });
//   //res.json(response);
//   //}          
// } else {
//   if (error) {
//     console.log("the error is : " + error);
//     return res.status(401).json({ status: 'error', error: error });
//   }
// }
//  })
// };

exports.changeProfilePicture = function (req, res) {

  console.log("rahul");
  console.log(req)
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  console.log(upload);
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
