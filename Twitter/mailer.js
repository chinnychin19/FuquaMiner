var nodemailer = require('nodemailer');
var config = require('./config.js');

var gmailUsername = config.gmailUsername;
var gmailPassword = config.gmailPassword;

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: gmailUsername,
		pass: gmailPassword
	}
});

function sendMail(recipient, text) {
	var mailOptions = {
			from: "TLDR Sports <"+gmailUsername+">",
			to: recipient,
			subject: "Error in fuqua code",
			text: text, // plaintext body
			// html: "<b>Hello world</b>" // html body
		}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
		if (error){
			console.log(error);
		} else{
			console.log("Message sent: " + response.message);
		}
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

exports.sendMail = sendMail;