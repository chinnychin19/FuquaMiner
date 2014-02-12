var config = require('./config.js');
var Twit = require('twit');
var csv = require('to-csv');

var T = new Twit(config.credentials);

var TIME_SECOND = 1000;
var TIME_MINUTE = 60 * TIME_SECOND;
var TIME_HOUR = 60 * TIME_MINUTE;
var TIME_DAY = 24 * TIME_HOUR;
var TIME_WEEK = 7 * TIME_DAY;

// setInterval(function() {
	T.get("statuses/user_timeline", 
		{
			screen_name: "Microsoft",
			count:1
		},
		function(err, reply) {
			for (var i in reply) {
				var obj = reply[i];
				var output = {};
				output.screen_name = obj.user.screen_name;
				output.location = obj.user.location;
				output.followers_count = obj.user.followers_count;
				output.friends_count = obj.user.friends_count;
				output.listed_count = obj.user.listed_count;
				//TODO: add more fields
				//TODO: learn how to change csv delimiter

				obj.text = obj.text.replace(","," ");
				console.log(obj.user);
				// console.log(obj.text);
				console.log(csv(obj));
				// for (var key in obj) {
				// 	console.log(key + ": "+obj[key]);
				// }
				// console.log(obj);
			}
		}
	);
// }, 3 * TIME_SECOND); //TIME_DAY);


// Just 3 methods to access the full twitter API.
// T.get(path, [params], callback)
// GET any of the REST API Endpoints.
// T.post(path, [params], callback)
// POST any of the REST API Endpoints.
// T.stream(path, [params])
// Use this with the Streaming API.
