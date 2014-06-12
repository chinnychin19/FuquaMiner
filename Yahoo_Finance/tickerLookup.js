
var unirest = require('unirest');
var fs = require('fs');

var companies = fs.readFileSync('./companies.in').toString().trim().split('\n');
for (i in companies) {
  getTicker(companies[i]);
}

function getTicker(company) {
  unirest.get("http://d.yimg.com/autoc.finance.yahoo.com/autoc?query="+company+"&callback=YAHOO.Finance.SymbolSuggest.ssCallback")
  .end(function(res) {
    var raw = res.body;
    var prefix = 'ssCallback(';
    var jsonText = raw.substring(raw.indexOf(prefix) + prefix.length, raw.length-1);
    var results = JSON.parse(jsonText).ResultSet.Result;
    if (results.length == 0) return;
    var result = results[0];
    var symbol = result.symbol;
    var exchange = result.exchDisp;
    console.log(symbol+"\t"+exchange+"\t"+company);
  });  
}
