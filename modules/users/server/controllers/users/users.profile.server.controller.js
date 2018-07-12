'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
 config = require(path.resolve('./config/config')),
User = mongoose.model('User'),
EsignDoc = mongoose.model('EsignDoc'),
EsignCredit = mongoose.model('EsignCredit'),
EsignCreditUsage = mongoose.model('EsignCreditUsage');
  var path = require('path');
 
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Update user details
 */

exports.eSignRecordsListUsed = function(req, res) {
  EsignCreditUsage.find({ 'org_id': req.body.org_id }).exec(function (err, EsignCreditUsage) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(200).send(EsignCreditUsage);
    }
  });
};

exports.eSignRecordsListPaid = function (req, res) {
console.log("inside esign Record list"+JSON.stringify(req.body));
  EsignCredit.find({ 'org_id': req.body.org_id }).exec(function (err, EsignCredit) {
    if (err) {
      return res.status(400).send({

        message: errorHandler.getErrorMessage(err)

      });
    } else {
      console.log("saved " + JSON.stringify(EsignCredit));
      res.jsonp(EsignCredit);

    }
  });



};



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

exports.eSignDoc = function (req, res,next) {
  var request = require("request");
    console.log(JSON.stringify(req.body));

    // console.log(req);
  var invitee_temp1 = JSON.parse(req.body.invitees);
  console.log(invitee_temp1);
  // var filePath1 = JSON.parse(req.body.invitees.filePath);
  var filedata = req.files.File.data;
  var filename = req.files.File.name;
  var invitee_temp = invitee_temp1.invitees;
  var filePath = invitee_temp1.filePath;
// console.log(filename);
  // console.log(req.files.File);

console.log(invitee_temp);
  console.log(filePath);



console.log("inside mail");


// console.log(req.files.File.name);
// console.log(req.files.File);

if (req.files.File.name) {
var temp_file_name = req.files.File.name.split(".");
console.log(temp_file_name);
    if (temp_file_name[temp_file_name.length - 1] != 'pdf'){
      console.log(temp_file_name[temp_file_name.length - 1]);
        var fs = require("fs");
        console.log(req.files.File);
      req.files.File.mv('public/'+req.files.File.name,function (err) {
        if (err){
            return res.status(500).send(err);
          }
            else{

          console.log("done");
          var request = require("request");
          var options = {
            method: 'POST',
            url: 'https://v2.convertapi.com/docx/to/pdf',
            qs: { Secret: 'O74LtGenyiCOiTZA' },
            headers:
              {
                'Cache-Control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
              },
            formData:
              { 
                Secret: 'O74LtGenyiCOiTZA',
                File:
                  {
                  value: fs.createReadStream('public/' + filename),
                    options:
                      {
                      filename: filename,
                        contentType: null
                      }
                  }
              }
          };
          console.log(options);
          request(options, function (error, response, body) {
            if(error){ throw new Error(error); 
              
            }
            else{
              var object = JSON.parse(body);
              console.log("inside convert api ");
              console.log(body);
              console.log(object.Files[0].FileName);
              var base64 = require('file-base64');
              var base64String = object.Files[0].FileData;
              var pdf_path = object.Files[0].FileName;
              base64.decode(base64String, 'public/pdf/' + object.Files[0].FileName , function (err, output) {
                var request = require("request");
                var vals = [];
                for (var i = 0; i < invitee_temp.length; i++) {
                  vals.push(invitee_temp[i].email);
                  console.log(invitee_temp[i].email);
                  console.log("test");
                }
                var finalto = vals.toString();
                console.log(finalto);
                // var mailmsg = req.body.msg;

                var optionz = {
                  method: 'POST',
                  url: 'http://dev.lexstart.in:3000/api/v2/mailtriggerforesign',
                  headers:
                    {
                      'Cache-Control': 'no-cache',
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                  form: { finalto: finalto }
                };
                //   var options = {
                //     method: 'POST',
                //     url: 'https://api.mailgun.net/v3/mg.lexstart.in/messages',
                //     headers:
                //       {
                //         'Cache-Control': 'no-cache',
                //         Authorization: 'Basic YXBpOmtleS1mMWY3NzQ4NjJjODFjYjhhYTNiNzE3ODdhZWVmNjEyNA==',
                //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                //       },
                //     formData:
                //       {
                //         from: 'LexStart<support@lexstart.in>',
                //         to: req.body.finalto,
                //         subject: 'Document E-Sign [LexStart Consultancy]',

                //         html: html2 //mailmsg + '<html><body><p style="font-size:17px">Please Click on the below Link for E-sign</p></br> <a href="http://34.217.67.22/authentication/esign">Click Here</a></html>  <html><div style="max-width:650px;direction:ltr;padding: 5px;" contenteditable>\n                        <div style="max-width:470px">\n                            <div style="color:rgb(80,0,80);max-width:650px;direction:ltr">\n                                <div style="max-width:470px">\n                                    <div style="max-width:650px;direction:ltr">\n                                        <div style="max-width:470px">\n                                            <div style="max-width:650px;direction:ltr">\n                                                <div style="max-width:470px">\n                                                    <div dir="ltr" style="color:rgb(34,34,34)">\n                                                        <div>\n                                                            <div>\n                                                                <br>\n                                                                <div style="max-width:650px;direction:ltr">\n                                                                    <div style="max-width:470px">\n                                                                        <div></div>\n                                                                        <table border="0" width="100%" style="padding-bottom:5px">\n                                                                            <tbody>\n                                                                                <tr>\n                                                                                    <td valign="top" width="10" style="padding-right:10px;width:10px;text-align:center;border-right:1px solid rgb(204,204,204)">\n                                                                                        <img width="65" height="100" src="https://ci6.googleusercontent.com/proxy/C6SR2CnGsLglkWUUwx7VD5mXt09BFPbnv0eEOEXuMHFslUdhfUygwDdA0zIdkoOokLxAb1VJIRrTcWhxBeW2fdIuh92-IVDxwy5XZeU18TF--hpB3IB8lt6LGsEyAjjIgbe-mGpe4SSMByfggGJ52cA9YQIHQBlcqtCjS1A=s0-d-e1-ft#https://gallery.mailchimp.com/a422fc2861fc206616fb9aeb6/images/d6fe5f66-0ecb-45af-b583-04dc51b4448c.png"\n                                                                                            alt="photo" style="margin-bottom:10px;float:left;margin-top:3px;border-radius:4px;width:102px;min-height:auto">\n                                                                                        <br>\n                                                                                        <div style="margin-top:10px">\n                                                                                            <a href="http://facebook.com/lexstartindia" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci5.googleusercontent.com/proxy/3ysP8__nmWC9GvjgQNYVHuKPnV4833DimOf3V-9WwOjwWDwaMMJkSo3gzm8VX1rwE6U1FQXgPgrIqK9T4LfTRK7Fspwn4S4t3Eqf518VBRs6bhaAb0cZUXU=s0-d-e1-ft#https://s3.amazonaws.com/images.wisestamp.com/icons_32/facebook.png"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="https://www.linkedin.com/company/lexstart" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci4.googleusercontent.com/proxy/SOGJyqe3XDVibRzjS7kIHMn0wxxN3gs6crnc5Tyx_rwYx-zapJaZ4W51mHXzz9XLp8D81kuRx4tU16AE-zG90B7FYe1huMd2_6tJGBkGoKZ7AwNkRe4w9zk=s0-d-e1-ft#https://s3.amazonaws.com/images.wisestamp.com/icons_32/linkedin.png"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="http://twitter.com/lexstart_india" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci4.googleusercontent.com/proxy/Ne2j5WCNrXJChVpox4Tw9qN4x2juZrIwRfa_jhQ7csji4INN_2t5yEGZ3EnnengOjUT6kT1uiVsxfSRZCeN5YyNHH00SAVCIGONR75SiMcz9j56s0s5uwe_OwV5WvI5lrRX3BJ08GmeRhw=s0-d-e1-ft#https://www.seeklogo.net/wp-content/uploads/2014/12/twitter-logo-vector-download.jpg"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="http://instagram.com/lexstart_india" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci6.googleusercontent.com/proxy/5ypguB8hIiL2HG8UG59Gbqr87Mh-vX-1f7UP_omBOopE09fDxKNn0aNuawsMRrtar-xLKrlxm75iu92QhZHNDAJnubvO4KUbQtmLecHL2TBqkNyIIIBaSt55h_UvBGcFe8wzMy1RuXreH_yK=s0-d-e1-ft#https://www.seeklogo.net/wp-content/uploads/2016/05/instagram-logo-vector-download.jpg"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>\n                                                                                        </div>\n                                                                                    </td>\n                                                                                    <td valign="top" style="padding-top:5px;line-height:15px;text-align:initial;padding-left:20px">\n                                                                                        <span style="font-size:14px;color:rgb(51,51,51);font-family:Helvetica,Arial,sans-serif">LexStart Consultancy Private Limited</span>\n                                                                                        <p style="margin-top:5px">\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Phone:&nbsp;</span>\n                                                                                            <a href="tel:+91%209324671747" style="color:rgb(130,130,130);font-size:12.8px;padding-right:5px;border-right:1px solid rgb(204,204,204)"\n                                                                                                target="_blank">+91 (22) 33835994</a>&nbsp;\n                                                                                            <span style="margin-left:5px;font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Website:&nbsp;</span>\n                                                                                            <a href="http://lexstart.in/" style="color:rgb(130,130,130);font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;text-decoration:none"\n                                                                                                target="_blank">www.lexstart.com&nbsp;</a>\n                                                                                            <br>\n                                                                                            <span style="padding-top:5px;font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Corporate Office :&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">3rd Floor, Igloo, Dalberg, Barodawala\n                                                                                                Mansion, Worli, Mumbai - 400018\n                                                                                            </span>&nbsp;\n                                                                                            <br>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Registered Office :&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">7916, Tulsiani Chambers, Nariman\n                                                                                                Point, Mumbai - 400021</span>&nbsp;\n                                                                                            <br>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Cin:&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">U74999MH2015PTC265981</span>&nbsp;\n                                                                                            <br>\n                                                                                        </p>\n                                                                                    </td>\n                                                                                </tr>\n                                                                            </tbody>\n                                                                        </table>\n                                                                        <br>\n                                                                        <div></div>\n                                                                        <div></div>\n                                                                        <div></div>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                    <div></div>\n                                                    <div></div>\n                                                    <div></div>\n                                                </div>\n                                            </div>\n                                            <div></div>\n                                            <div></div>\n                                            <div></div>\n                                        </div>\n                                    </div>\n                                    <div></div>\n                                    <div></div>\n                                    <div></div>\n                                </div>\n                            </div>\n                        </div>\n                    </div></html>'
                //       }
                //   }



                console.log(optionz);
                console.log(JSON.stringify(options));
                request(optionz, function (error, response, body) {
                  if (error) {
                    console.log("error");

                  }
                  else {
                    console.log("Done!");
                    console.log("body : " + JSON.stringify(body));
                  }
                });

                console.log("Length is  : ----1 " + invitee_temp.length);


                switch (invitee_temp.length) {

                  case 1:
                    console.log("rahul");
                    var options = {
                      method: 'POST',
                      url: 'https://app.leegality.com/api/v1.0/sr/create',
                      headers:
                        {
                          'Cache-Control': 'no-cache',
                          'X-Auth-Token': 'OVQGQhc6YA23uH6uHe8qDwG5jkZ2M355',
                          Accept: 'application/json',
                          'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                        },
                      formData:
                        {
                          'files[0].file':
                            {
                              value: fs.createReadStream('public/pdf/'+pdf_path),
                              options:
                                {
                                  filename: pdf_path,
                                  contentType: null
                                }
                            },
                          "invitees[0].name": invitee_temp[0].name,
                          "invitees[0].email": invitee_temp[0].email,
                          "invitees[0].emailNotification": "false",
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": "true",
                          "redirectUrl": "http://lexstart.in/esigncomplete/success.html"


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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
                                  contentType: null
                                }
                            },
                          "invitees[0].name": invitee_temp[0].name,
                          "invitees[0].email": invitee_temp[0].email,
                          "invitees[0].emailNotification": "false",
                          "invitees[1].name": invitee_temp[1].name,
                          "invitees[1].email": invitee_temp[1].email,
                          "invitees[1].emailNotification": "false",
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": "true",
                          "redirectUrl": "http://lexstart.in/esigncomplete/success.html"
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
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
                              value: fs.createReadStream('public/pdf/' + pdf_path),
                              options:
                                {
                                  filename: pdf_path,
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
                          "webhookUrl": "http://34.217.67.22:8443/api/webhook",
                          "deleteOnComplete": true,
                          "redirectUrl": "http://lexstart.in/esigncomplete/success.html"
                        }
                    };

                    break;

                  default:

                    console.log("PROBLEM IN INVITEES-LENGTH");
                }
                request(options, function (error, response, body) {
                  if (error) {
                    console.log("Error"+error);
                    throw new Error(error);
                  } else {
                    console.log("console body is :" + body);
                    var signRequest = JSON.parse(body);
                    console.log(filePath);
                    for (var i = 0; i < signRequest.data.requests.length; i++) {
                      var newEsignDoc = new EsignDoc({
                        "name": signRequest.data.requests[i].name, "email": signRequest.data.requests[i].email,
                        "signUrl": signRequest.data.requests[i].signUrl, "signed": signRequest.data.requests[i].signed, "rejected": signRequest.data.requests[i].rejected, "revoked": signRequest.data.requests[i].revoked, "filePath": filePath

                      });
                      newEsignDoc.save(function (err) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {
                          console.log("Saved!");

                        }
                      });
                    }
                    return res.status(200).send(body);
                  }
                });
              });
            }
          });

    }
      })
      
}
//second conditon Bcoz picking of saved file buffer write not possible.
  if (temp_file_name[temp_file_name.length - 1] == 'pdf') {
    console.log("pdf");
    var request = require("request");
    var vals = [];
    for (var i = 0; i < invitee_temp.length; i++) {
      vals.push(invitee_temp[i].email);
      console.log(invitee_temp[i].email);
      console.log("test");
    }
    var finalto = vals.toString();
    console.log(finalto);
    // var mailmsg = req.body.msg;

    var optionz = {
      method: 'POST',
      url: 'http://dev.lexstart.in:3000/api/v2/mailtriggerforesign',
      headers:
        {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      form: { finalto: finalto }
    };
    //   var options = {
    //     method: 'POST',
    //     url: 'https://api.mailgun.net/v3/mg.lexstart.in/messages',
    //     headers:
    //       {
    //         'Cache-Control': 'no-cache',
    //         Authorization: 'Basic YXBpOmtleS1mMWY3NzQ4NjJjODFjYjhhYTNiNzE3ODdhZWVmNjEyNA==',
    //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    //       },
    //     formData:
    //       {
    //         from: 'LexStart<support@lexstart.in>',
    //         to: req.body.finalto,
    //         subject: 'Document E-Sign [LexStart Consultancy]',

    //         html: html2 //mailmsg + '<html><body><p style="font-size:17px">Please Click on the below Link for E-sign</p></br> <a href="http://34.217.67.22/authentication/esign">Click Here</a></html>  <html><div style="max-width:650px;direction:ltr;padding: 5px;" contenteditable>\n                        <div style="max-width:470px">\n                            <div style="color:rgb(80,0,80);max-width:650px;direction:ltr">\n                                <div style="max-width:470px">\n                                    <div style="max-width:650px;direction:ltr">\n                                        <div style="max-width:470px">\n                                            <div style="max-width:650px;direction:ltr">\n                                                <div style="max-width:470px">\n                                                    <div dir="ltr" style="color:rgb(34,34,34)">\n                                                        <div>\n                                                            <div>\n                                                                <br>\n                                                                <div style="max-width:650px;direction:ltr">\n                                                                    <div style="max-width:470px">\n                                                                        <div></div>\n                                                                        <table border="0" width="100%" style="padding-bottom:5px">\n                                                                            <tbody>\n                                                                                <tr>\n                                                                                    <td valign="top" width="10" style="padding-right:10px;width:10px;text-align:center;border-right:1px solid rgb(204,204,204)">\n                                                                                        <img width="65" height="100" src="https://ci6.googleusercontent.com/proxy/C6SR2CnGsLglkWUUwx7VD5mXt09BFPbnv0eEOEXuMHFslUdhfUygwDdA0zIdkoOokLxAb1VJIRrTcWhxBeW2fdIuh92-IVDxwy5XZeU18TF--hpB3IB8lt6LGsEyAjjIgbe-mGpe4SSMByfggGJ52cA9YQIHQBlcqtCjS1A=s0-d-e1-ft#https://gallery.mailchimp.com/a422fc2861fc206616fb9aeb6/images/d6fe5f66-0ecb-45af-b583-04dc51b4448c.png"\n                                                                                            alt="photo" style="margin-bottom:10px;float:left;margin-top:3px;border-radius:4px;width:102px;min-height:auto">\n                                                                                        <br>\n                                                                                        <div style="margin-top:10px">\n                                                                                            <a href="http://facebook.com/lexstartindia" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci5.googleusercontent.com/proxy/3ysP8__nmWC9GvjgQNYVHuKPnV4833DimOf3V-9WwOjwWDwaMMJkSo3gzm8VX1rwE6U1FQXgPgrIqK9T4LfTRK7Fspwn4S4t3Eqf518VBRs6bhaAb0cZUXU=s0-d-e1-ft#https://s3.amazonaws.com/images.wisestamp.com/icons_32/facebook.png"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="https://www.linkedin.com/company/lexstart" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci4.googleusercontent.com/proxy/SOGJyqe3XDVibRzjS7kIHMn0wxxN3gs6crnc5Tyx_rwYx-zapJaZ4W51mHXzz9XLp8D81kuRx4tU16AE-zG90B7FYe1huMd2_6tJGBkGoKZ7AwNkRe4w9zk=s0-d-e1-ft#https://s3.amazonaws.com/images.wisestamp.com/icons_32/linkedin.png"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="http://twitter.com/lexstart_india" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci4.googleusercontent.com/proxy/Ne2j5WCNrXJChVpox4Tw9qN4x2juZrIwRfa_jhQ7csji4INN_2t5yEGZ3EnnengOjUT6kT1uiVsxfSRZCeN5YyNHH00SAVCIGONR75SiMcz9j56s0s5uwe_OwV5WvI5lrRX3BJ08GmeRhw=s0-d-e1-ft#https://www.seeklogo.net/wp-content/uploads/2014/12/twitter-logo-vector-download.jpg"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>&nbsp;\n                                                                                            <a href="http://instagram.com/lexstart_india" style="color:rgb(17,85,204)" target="_blank">\n                                                                                                <img width="16" height="16" src="https://ci6.googleusercontent.com/proxy/5ypguB8hIiL2HG8UG59Gbqr87Mh-vX-1f7UP_omBOopE09fDxKNn0aNuawsMRrtar-xLKrlxm75iu92QhZHNDAJnubvO4KUbQtmLecHL2TBqkNyIIIBaSt55h_UvBGcFe8wzMy1RuXreH_yK=s0-d-e1-ft#https://www.seeklogo.net/wp-content/uploads/2016/05/instagram-logo-vector-download.jpg"\n                                                                                                    style="border-radius:0px;border:0px;width:16px;min-height:16px">\n                                                                                            </a>\n                                                                                        </div>\n                                                                                    </td>\n                                                                                    <td valign="top" style="padding-top:5px;line-height:15px;text-align:initial;padding-left:20px">\n                                                                                        <span style="font-size:14px;color:rgb(51,51,51);font-family:Helvetica,Arial,sans-serif">LexStart Consultancy Private Limited</span>\n                                                                                        <p style="margin-top:5px">\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Phone:&nbsp;</span>\n                                                                                            <a href="tel:+91%209324671747" style="color:rgb(130,130,130);font-size:12.8px;padding-right:5px;border-right:1px solid rgb(204,204,204)"\n                                                                                                target="_blank">+91 (22) 33835994</a>&nbsp;\n                                                                                            <span style="margin-left:5px;font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Website:&nbsp;</span>\n                                                                                            <a href="http://lexstart.in/" style="color:rgb(130,130,130);font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;text-decoration:none"\n                                                                                                target="_blank">www.lexstart.com&nbsp;</a>\n                                                                                            <br>\n                                                                                            <span style="padding-top:5px;font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Corporate Office :&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">3rd Floor, Igloo, Dalberg, Barodawala\n                                                                                                Mansion, Worli, Mumbai - 400018\n                                                                                            </span>&nbsp;\n                                                                                            <br>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Registered Office :&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">7916, Tulsiani Chambers, Nariman\n                                                                                                Point, Mumbai - 400021</span>&nbsp;\n                                                                                            <br>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(167,167,167)">Cin:&nbsp;</span>\n                                                                                            <span style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Arial;color:rgb(130,130,130)">U74999MH2015PTC265981</span>&nbsp;\n                                                                                            <br>\n                                                                                        </p>\n                                                                                    </td>\n                                                                                </tr>\n                                                                            </tbody>\n                                                                        </table>\n                                                                        <br>\n                                                                        <div></div>\n                                                                        <div></div>\n                                                                        <div></div>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                    <div></div>\n                                                    <div></div>\n                                                    <div></div>\n                                                </div>\n                                            </div>\n                                            <div></div>\n                                            <div></div>\n                                            <div></div>\n                                        </div>\n                                    </div>\n                                    <div></div>\n                                    <div></div>\n                                    <div></div>\n                                </div>\n                            </div>\n                        </div>\n                    </div></html>'
    //       }
    //   }



    console.log(optionz);
    console.log(JSON.stringify(options));
    request(optionz, function (error, response, body) {
      if (error) {
        console.log("error");

      }
      else {
        console.log("Done!");
        console.log("body : " + JSON.stringify(body));
      }
    });

    console.log("Length is  : ---- " + invitee_temp.length);


    switch (invitee_temp.length) {

      case 1:
        console.log("rahul");
        var options = {
          method: 'POST',
          url: 'https://app.leegality.com/api/v1.0/sr/create',
          headers:
            {
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": "true",
              "redirectUrl": "http://lexstart.in/esigncomplete/success.html"


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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": "true",
              "redirectUrl": "http://lexstart.in/esigncomplete/success.html"
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
              "webhookUrl": "http://34.217.67.22:8443/api/webhook",
              "deleteOnComplete": true,
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
        console.log("Error");
        throw new Error(error);
      } else {
        console.log("console body is :" + body);
        var signRequest = JSON.parse(body);
        console.log(filePath);
        for (var i = 0; i < signRequest.data.requests.length; i++) {
          var newEsignDoc = new EsignDoc({
            "name": signRequest.data.requests[i].name, "email": signRequest.data.requests[i].email,
            "signUrl": signRequest.data.requests[i].signUrl, "signed": signRequest.data.requests[i].signed, "rejected": signRequest.data.requests[i].rejected, "revoked": signRequest.data.requests[i].revoked,
            "filePath": filePath
          });
          newEsignDoc.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              console.log("Saved!");

            }
          });
        }
        return res.status(200).send(body);
      }
    });


  }
    // })
  // });   
}
};

exports.eSigncredits = function (req, res) {
  console.log("inside esign credits"+JSON.stringify(req.body));
 var esignCredit = new EsignCredit(req.body);
  esignCredit.save(function (err, esignCredit) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(JSON.stringify(esignCredit)+"success");
      res.jsonp(esignCredit);

    }
  });
};
exports.eSigncreditsUsage = function (req, res) {
  console.log("inside esign credit usage" + JSON.stringify(req.body));
var  esignCreditUsage = new EsignCreditUsage(req.body);
  esignCreditUsage.save(function (err, esignCreditUsage) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(JSON.stringify(esignCreditUsage)+"result usage");
      res.jsonp(esignCreditUsage);
    }
  });
};

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

exports.updateEsignDocList = function (req, res) {
  console.log(req);

  // var emailToSearch = req.query.email;
  // EsignDoc.find({ email: emailToSearch }).exec(function (err, response) {
  //   if (err) {
  //     res.status(400).json({ status: "fail" });
  //   } else {
  //     res.json(response);
  //   }
  // });


};

exports.getEsignDocList = function(req,res){
    var emailToSearch = req.query.email;
   EsignDoc.find({email:emailToSearch}).exec(function(err,response){
      if(err){
          res.status(400).json({status:"fail"});
      } else {
        console.log(JSON.stringify(response[0].email));
          res.json(response);
      }
   });

};

exports.getEsignDocListpdf = function (req, res) {
  var emailToSearch = req.query.email;
  EsignDoc.find({ filePath: emailToSearch }).exec(function (err, response) {
    if (err) {
      res.status(400).json({ status: "fail" });
    } else {
      console.log(JSON.stringify(response[0].email));
      res.json(response);
    }
  });

};


exports.eSignDocwebhook = function (req, res) {

 console.log(req.body);
  EsignDoc.update({
    signUrl : req.body.requests[0].signUrl},{ signed: true }).exec(function (err,response){
      if(err){
        console.log(err+ " <== error ");
      }
      else{

        EsignDoc.find({ signUrl : req.body.requests[0].signUrl }).exec(function (err, response) {
          if (err) {
            res.status(400).json({ status: "fail" });
          } else {
            
            console.log(response[0].filePath);   
            var ful = response[0].filePath;
            var path1 = ful.split('/')[3] + '_' + ful.split('/')[4];
            console.log(path1);
            var pdfname = path1.split('.')[0] + '.pdf'
            console.log(pdfname);
                    console.log("done");
                    var base64 = require('file-base64');
                    var base64String = req.body.files[0];
                    base64.decode(base64String, 'public/pdf/' + pdfname, function (err, output) {
                      var fs = require("fs");
                      var request = require("request");
                      var options = {
                        method: 'POST',
                        url: 'http://dev.lexstart.in:3000/api/v2/esignSave2',
                        //  qs: { Secret: 'O74LtGenyiCOiTZA' },
                        headers:
                        {
                          'Cache-Control': 'no-cache',
                          'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                        },
                        formData:
                        {
                          File:
                          {
                            value: fs.createReadStream('public/pdf/' + pdfname),
                            options:
                            {
                              filename: pdfname,
                              contentType: null
                            }
                          }
                        }
                      };
                      console.log(options);

                      request(options, function (error, response, body) {
                        if (error) {
                          console.log("error");
                        }
                        res.jsonp({ "success": "success" });
                      });

        })


          }
        });



























       

      }

    
      
    }

 )

  // var request = require("request");


  // var options = {
  //   method: 'POST',
  //   url: 'https://api.mailgun.net/v3/mg.lexstart.in/messages',
  //   headers:
  //     {
  //       'Postman-Token': '34c9dfec-32dd-401f-89a1-902f194ea7af',
  //       'Cache-Control': 'no-cache',
  //       Authorization: 'Basic YXBpOmtleS1mMWY3NzQ4NjJjODFjYjhhYTNiNzE3ODdhZWVmNjEyNA==',
  //       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  //     },
  //   formData:
  //     {
  //       from: 'support@lexstart.in',
  //       to: 'rahul@lexstart.in',
  //       'subject ': 'hello testing mailgun',
  //       text: 'hello'
  //     }
  // };

  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);

  //   console.log(body);
  // });





};
