var config = require('../config.js');
var Twit = require('twit');
var fs = require('fs');

var TScraper = new Twit(config.twitterCredentials);

readScreenNames('../screen_names_already_scraped.in');

// When called, submits at most RATE_LIMIT requests from the request queue
function follow(screen_name) {
	TScraper.post("friendships/create", {"screen_name" : screen_name}, function(err, reply) {
		if (err) {
			console.log("Error for "+screen_name);
			console.log(err);
		} else {
			// console.log('following '+screen_name);
		}
	});
}

// Reads all lines from an input file
// Each line consists of a screen name
// Calls a helper function to scrape all tweets of each screen name
function readScreenNames(filename) {
	fs.readFile(filename, function(err, data) {
		var screen_names = data.toString().trim().split('\n');
		screen_names.forEach(function(element) {
			var screen_name = element.trim();
			follow(screen_name);
		});
	});
}