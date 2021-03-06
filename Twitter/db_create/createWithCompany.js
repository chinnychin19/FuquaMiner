var config = require('../config.js');
var Twit = require('twit');
var bigInt = require('big-integer');
var fs = require('fs');
var Constants = require('../Constants.js');
var mongo = require('../mongo');
var companyMap = require('./companyMap.js').companyMap;

var TScraper = new Twit(config.twitterCredentials);

var connectURI = config.mongoConnectUri;
var collectionName = 'Microsoft_Accounts';

var requestQueue = []; //stores the relevant data to be submitted in each tweet
readScreenNames('../screen_names.in');

// Call main almost immediately (give time for screen_names to be read)
setTimeout(mainFunction, 4*Constants.TIME_SECOND);
// Continue calling main periodically
setInterval(mainFunction, Constants.TIME_SECOND * 60);

// When called, submits at most RATE_LIMIT requests from the request queue
function mainFunction() {
	console.log('calling main');
	var limit = 10; // This whole file should get replaced when db_create_2 stops rate limiting... so magic numbers are okay for now.
	while (requestQueue.length > 0 && limit > 0) {
		var requestObject = requestQueue.shift();
		limit--;
		console.log("sending request for "+requestObject.options.screen_name);
		TScraper.get(requestObject.request, requestObject.options, requestObject.callback);
	}
	if (requestQueue.length == 0) {
		console.log("All requests sent");
	} else {
		console.log("Pending requests in queue: "+requestQueue.length);
	}
}

function log(str) {
	console.log(str);
}

// Reads all lines from an input file
// Each line consists of a screen name
// Calls a helper function to scrape all tweets of each screen name
function readScreenNames(filename) {
	fs.readFile(filename, function(err, data) {
		var screen_names = data.toString().trim().split('\n');
		screen_names.forEach(function(element) {
			var screen_name = element.trim();
			log(screen_name);
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
			requestQueue.push(requestObject);
			log("Error!");
			log(err);
			return;
		}
		for (var i in reply) {
			var obj = reply[i];
			obj.screen_name = screen_name;
			obj._id = obj.id_str;
			obj.company = (screen_name in companyMap) ? companyMap[screen_name] : "";
		}
		mongo.addObjectsToDB(connectURI, collectionName, reply);
		if (reply.length > 0) {
			maxTweetId = bigInt(reply[reply.length-1].id_str).prev().toString();
			scrapeAllTweets_helper(screen_name, maxTweetId);
		} else {
			fs.appendFileSync('completed.txt', screen_name+"\n");
			log('Done! ('+screen_name+')');
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
