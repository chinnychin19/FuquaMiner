/**

THIS SERVER WILL UPDATE THE ACCESS TOKEN STORED IN accessToken.js
THE TOKEN EXPIRES EVERY 60 DAYS.

**/



var credentials = require('./config.js').credentials;
var unirest = require('unirest');
var fs = require('fs');

var express = require('express');
var app = express();
var redirect_uri = 'http://localhost:8080/redirect';

app.get('/', function (req, res) {
  res.redirect('https://www.linkedin.com/uas/oauth2/authorization'+
    '?response_type=code&client_id='+credentials.api_key+'&state='+
    credentials.state+'&redirect_uri='+redirect_uri);
});

app.get('/redirect', function (req, res) {
  var authCode = req.query.code;
  // res.redirect('https://www.linkedin.com/uas/oauth2/accessToken?'+
  //   'grant_type=authorization_code&code='+authCode+'&redirect_uri'+
  //   '=http://localhost:8080/home&client_id='+credentials.api_key+'&client_secret='+credentials.secret_key);
  unirest.post('https://www.linkedin.com/uas/oauth2/accessToken')
    .send({
      "grant_type" : "authorization_code",
      "code" : authCode,
      "redirect_uri" : redirect_uri,
      "client_id" : credentials.api_key,
      "client_secret" : credentials.secret_key
    })
    .end(function (response) {
      var accessToken = response.body.access_token;
      fs.writeFileSync("accessToken.js",
        "exports.accessToken='"+accessToken+"';");
      res.send(response.body);
    });
});

app.listen(8080);