var config = require('../config.js');
var Twit = require('twit');
var bigInt = require('big-integer');
var fs = require('fs');
var Constants = require('../Constants.js');
var mongo = require('../mongo');
var companyMap = require('./companyMap.js').companyMap;

var TScraper = new Twit(config.chinmayCredentials2);

var connectURI = config.mongoConnectUri;
var collectionName = 'Microsoft_Accounts';

var allScreenNames = process.argv.slice(2);
if (allScreenNames.length == 0) {
	console.log("Error!! Requires at least one space-separated screen name provided");
	return;
}
var screen_name = allScreenNames.shift();

var numCalls = 0;
scrapeAllTweets(screen_name);

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
			log('Done! ('+screen_name+')\nNumber of API calls: '+numCalls);
			if (allScreenNames.length > 0) {
				numCalls = 0;
				nextScreenName = allScreenNames.shift();
				scrapeAllTweets(nextScreenName);
			}
		}
	}
	numCalls++;
	TScraper.get(requestObject.request, requestObject.options, requestObject.callback);
}

function log(str) {
	console.log(str);
}

// Just 3 methods to access the full twitter API.
// T.get(path, [params], callback)
// GET any of the REST API Endpoints.
// T.post(path, [params], callback)
// POST any of the REST API Endpoints.
// T.stream(path, [params])
// Use this with the Streaming API.
