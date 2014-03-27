var unirest = require('unirest');
var xml2js = require('xml2js');
var et = require('elementtree');
var str = require('string');
var cheerio = require('cheerio');
var mongo = require('./mongo.js');
var config = require('./config.js');
var crypto = require('crypto');

// var fs = require('fs');



scrape("http://omicsonline.org/current.xml",
	function (response) {
		var xml = response.raw_body;
		var tree = et.parse(xml);
		var links = tree.findall('channel/item/link');

		var count = 0;
		for (var key in links) {
			var link = links[key].text;
			if (str(link).contains('.php?aid=')) {
				scrape(link, function(response) { //link is trimmed of everything after '?', so we save the original link in origLink
					var html = response.raw_body;
					$ = cheerio.load(html);
					var article = $('#fulltext table').text();
					if (article.length > 0) {
						count++;
						var url = response.link;
						var hash = crypto.createHash('md5').update(article).digest('hex'); //hash of the article text
						mongo.addObjectsToDB(config.mongoLabUri, "openAccess", [{ // third parameter is a LIST of json objects!
							"_id"  : hash, //primary key to prevent duplicates
							"link" : url,
							"data" : article
						}]);

						// // save files:
						// var outFileName = hash;
						// fs.writeFileSync("./articles/"+outFileName, article);
					}
				});
			}
		}
	});

function scrape(url, callback) {
	unirest.get(url)
		.headers({})
		.end(function (response) {
			response.link = url;
			callback(response)
		});
}