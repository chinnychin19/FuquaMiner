var config = require('../config.js');
var Twit = require('twit');
var bigInt = require('big-integer');
var fs = require('fs');
var Constants = require('../Constants.js');
var mongo = require('../mongo');

var TScraper = new Twit(config.twitterCredentials);

var connectURI = config.mongoConnectUri;
var collectionName = 'Microsoft_Accounts';

var PERIOD = Constants.RATE_WINDOW / Constants.RATE_LIMIT;

var requestQueue = []; //stores the relevant data to be submitted in each tweet
readScreenNames('../screen_names.in');

// Keep calling main periodically
setInterval(mainFunction, PERIOD);

// When called, submits at most RATE_LIMIT requests from the request queue
function mainFunction() {
	if (requestQueue.length == 0) {
		console.log("All requests sent");
		return;
	}
	console.log("Num pending: "+requestQueue.length);
	var requestObject = requestQueue.shift();
	console.log("sending: "+requestObject.options.screen_name);
	TScraper.get(requestObject.request, requestObject.options, requestObject.callback);
}

// Reads all lines from an input file
// Each line consists of a screen name
// Calls a helper function to scrape all tweets of each screen name
function readScreenNames(filename) {
	fs.readFile(filename, function(err, data) {
		var screen_names = data.toString().trim().split('\n');
		screen_names.forEach(function(element) {
			var screen_name = element.trim();
			scrapeAllTweets(screen_name);
		});
	});
}


function scrapeAllTweets(screen_name) {
	scrapeAllTweets_helper(screen_name);
}

function scrapeAllTweets_helper(screen_name, maxTweetId) {
	var options = {};
	options.screen_name = screen_name;
	options.count = 200;
	if (maxTweetId) { // if no max id provided, get most recent is default
		options.max_id = maxTweetId;
	}

	var requestObject = {};
	requestObject.request = "statuses/user_timeline";
	requestObject.options = options;
	requestObject.callback = function(err, reply) {
		if (err) {
			requestQueue.unshift(requestObject);
			console.log("rate limit exceeded. please be patient.");
			return;
		}
		for (var i in reply) {
			var obj = reply[i];
			obj.screen_name = screen_name;
			obj._id = obj.id_str;
		}
		mongo.addObjectsToDB(connectURI, collectionName, reply);
		if (reply.length > 0) {
			maxTweetId = bigInt(reply[reply.length-1].id_str).prev().toString();
			scrapeAllTweets_helper(screen_name, maxTweetId);
		} else {
			console.log('Done with '+screen_name);
		}
	}
	requestQueue.push(requestObject);
}

// Just 3 methods to access the full twitter API.
// T.get(path, [params], callback)
// GET any of the REST API Endpoints.
// T.post(path, [params], callback)
// POST any of the REST API Endpoints.
// T.stream(path, [params])
// Use this with the Streaming API.
