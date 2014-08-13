var express = require('express');
var app = express();

var config = require('./config.js');
var client_id = config.client_id;
var client_secret = config.client_secret;
var redirect1 = "http://localhost:3000/code";
var loginUrl = "https://www.facebook.com/dialog/oauth?client_id="+client_id+"&redirect_uri="+redirect1+"&response_type=code";

app.get('/login', function (req, res) {
  console.log('url1: '+loginUrl+"\n\n");
  res.redirect(loginUrl);
});

app.get('/code', function (req, res) {
  var code = req.query.code;
  var nextUrl = "https://graph.facebook.com/oauth/access_token?"+
    "client_id="+client_id+
    "&redirect_uri="+redirect1+
    "&client_secret="+client_secret+
    "&code="+code;
  console.log('url2: '+nextUrl+"\n\n");
  res.redirect(nextUrl);
});

app.listen(3000)