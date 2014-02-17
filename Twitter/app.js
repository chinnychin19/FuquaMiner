var config = require('./config.js');
var Twit = require('twit');
var csv = require('./csv.js');
var bigInt = require('big-integer');
var fs = require('fs');

var T = new Twit(config.credentials);

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
}

var DEFAULT_NUM_TWEETS = 190;

var args = process.argv.slice(2);
var numTweets = args.indexOf('-n') >= 0 ? Number(args[args.indexOf('-n') + 1]) : DEFAULT_NUM_TWEETS;
var DEBUG_MODE = args.indexOf('-d') >= 0;

function log(str) {
	if (DEBUG_MODE) {
		console.log(str);
	}
}

fs.readFile('./screen_names.in', function(err, data) {
	var screen_names = data.toString().trim().split('\n');
	screen_names.forEach(function(element) {
		log(element.trim());
		scrapeAllTweets(element.trim(), numTweets);
	});
});



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

	T.get("statuses/user_timeline", 
		options,
		function(err, reply) {
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
	);
}

// Just 3 methods to access the full twitter API.
// T.get(path, [params], callback)
// GET any of the REST API Endpoints.
// T.post(path, [params], callback)
// POST any of the REST API Endpoints.
// T.stream(path, [params])
// Use this with the Streaming API.
