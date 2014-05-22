var credentials = require('./config.js').credentials;
var accessToken = require('./accessToken.js').accessToken;
var unirest = require('unirest');
var https = require('https');

var suffix = "oauth2_access_token="+accessToken;
var fieldSelectors = ":(id,name,num-followers,ticker,stock-exchange,company-type,status,employee-count-range,founded-year)";

https.get('https://api.linkedin.com/v1/companies/universal-name=microsoft'+fieldSelectors+'?'+suffix, function(res) {
  res.on('data', function(d) {
    console.log(d.toString());
  });
});
