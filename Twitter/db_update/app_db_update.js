var config = require('../config.js');
var Twit = require('twit');
var TScraper = new Twit(config.twitterCredentials);
var mongo = require('../mongo');
var mailer = require('../mailer.js');

var connectUri = config.mongoConnectUri;


var refreshRate = 1000*60*60*6; //reconnect every 6 hours
var stream;

try {
	doStream();
	setInterval(function() {
		// stream.stop();
		stream.start();
	}, refreshRate);
} catch (err) {
	mailer.sendMail(config.myEmail, err);
}

function doStream() {
	stream = TScraper.stream('user', {
	});

	stream.on('connect', function(request) {
		console.log('connected!');
		console.log();
	});

	stream.on('disconnect', function(disconnectMessage) {
		console.log('disconnected!');
		console.log(disconnectMessage);
		console.log();
		// setTimeout(stream.start, 10*1000);
	});

	stream.on('reconnect', function (request, response, connectInterval) {
		console.log('reconnecting attempt');
		console.log();
	});

	stream.on('tweet', function (tweet) {
		var message = 'tweet from '+tweet.user.screen_name;
		console.log(message);
		console.log(tweet.text);
		console.log();
		tweet._id = tweet.id_str;
		mongo.addObjectsToDB(connectUri, "Microsoft_Accounts", [tweet]);
	});

	stream.on('warning', function (warning) {
		console.log(warning);
	});

	stream.on('limit', function (limitMessage) {
		console.log(limitMessage);
	});
}
