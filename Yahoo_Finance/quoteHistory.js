// TODO: much better option is https://code.google.com/p/yahoo-finance-managed/wiki/CSVAPI

var unirest = require('unirest');

getHistory("MSFT", "2010-09-11", "2010-09-14");

function getHistory(symbol, startDate, endDate) {
  unirest.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+
    symbol    + '%22%20and%20startDate%20%3D%20%22'+
    startDate + '%22%20and%20endDate%20%3D%20%22' +
    endDate   + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
  .end(function(res) {
    var quotes = res.body.query.results.quote;
    console.log(quotes);
    console.log(quotes.length + " quotes found.");
  });  
}
