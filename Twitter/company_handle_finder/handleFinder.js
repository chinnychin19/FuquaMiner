var config = require('../config.js');
var Twit = require('twit');
var fs = require('fs');
var Constants = require('../Constants.js');

var TScraper = new Twit(config.twitterCredentials);
var screenNames = [];

var companies = fs.readFileSync("companies.in").toString().trim().split('\n');
for (i in companies) {
	var company = companies[i].trim();
	doSearch(company);
}

function doSearch(company) {
	var options = {
		"q" : company,
		"count" : 20,
		"include_entities" : false
	};
	TScraper.get("users/search", options, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		if (data.length == 0) {
			console.log("N/A for "+company);
		}
		for (i in data) {
			console.log(company + ":" + data[i].screen_name);
			screenNames.push(data[i].screen_name);
		}
	});
}

	






// Just 3 methods to access the full twitter API.
// T.get(path, [params], callback)
// GET any of the REST API Endpoints.
// T.post(path, [params], callback)
// POST any of the REST API Endpoints.
// T.stream(path, [params])
// Use this with the Streaming API.
