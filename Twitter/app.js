var config = require('./config.js');
var Twit = require('twit');
var csv = require('./csv.js');
var bigInt = require('big-integer');
var fs = require('fs');

var TScraper = new Twit(config.credentials);

var TIME_SECOND = 1000;
var TIME_MINUTE = 60 * TIME_SECOND;
var TIME_HOUR = 60 * TIME_MINUTE;
var TIME_DAY = 24 * TIME_HOUR;
var TIME_WEEK = 7 * TIME_DAY;

var keyObj = {
	"screen_name":null,
	"id_str":null,
	"text":null,
	"created_at":null,
	"retweet_count":null,
	"favorite_count":null,
	"truncated":null,
	"in_reply_to_user_id_str":null,
	"in_reply_to_status_id_str":null,
	"geo":null,
	"possibly_sensitive":null,
	"place":null,
	"in_reply_to_screen_name":null,
	"source":null,
}

var DEFAULT_NUM_TWEETS = 100000;

var RATE_LIMIT = 3;
var RATE_PERIOD = 3*TIME_SECOND;

var args = process.argv.slice(2);
var numTweets = args.indexOf('-n') >= 0 ? Number(args[args.indexOf('-n') + 1]) : DEFAULT_NUM_TWEETS;
var DEBUG_MODE = args.indexOf('-d') >= 0;

var requestQueue = []; //stores the relevant data to be submitted in each tweet
readScreenNames('./screen_names.in');
setInterval(mainFunction, RATE_PERIOD);

// When called, submits at most RATE_LIMIT requests from the request queue
function mainFunction() {
	console.log('calling main');
	var limit = RATE_LIMIT;
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

// Only prints to console when executed with -d option (debug)
function log(str) {
	if (DEBUG_MODE) {
		console.log(str);
	}
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
			scrapeAllTweets(screen_name, numTweets);
		});
	});
}


function scrapeAllTweets(screen_name, numTweets) {
	var outfile = csv.csvWriteStream('./output/'+screen_name, keyObj);
	scrapeAllTweets_helper(screen_name, outfile, numTweets);
}

function scrapeAllTweets_helper(screen_name, outfile, numTweets, maxTweetId) {
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
				throw err;
			}
			for (var i in reply) {
				var obj = reply[i];
				obj.screen_name = screen_name;
				outfile.addRow(obj);
			}
			if (reply.length > 0 && numTweets-reply.length > 0) {
				log('still scraping... ('+screen_name+')');
				maxTweetId = bigInt(reply[reply.length-1].id_str).prev().toString();
				scrapeAllTweets_helper(screen_name, outfile, numTweets-reply.length, maxTweetId);
			} else {
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
