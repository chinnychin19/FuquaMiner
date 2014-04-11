var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

function addObjectsToDB(connectURI, collectionName, data) { // data is a list of JSON objects
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			console.log(err);
		}

		var numSent = 0;
		var dupCount = 0;
		var collection = db.collection(collectionName);
		for (var i = 0; i < data.length; i++) { // for each obj in the data list
			var obj = data[i];
			collection.insert(obj, function (err, docs) { // make an async call to add the current object
				numSent++;
				if (err) {
					if (err.code == '11000') {
						dupCount++
					} else {
						throw err; //memory error?
					}
				}
				if (numSent == data.length) { // report when all db additions complete
					console.log("All objects sent to MongoDB from list of length "+data.length);
					if (dupCount > 0) {
						console.log("***Note: There were "+dupCount+" duplicates***");
					}
				}
			});
		}
	})
}

exports.addObjectsToDB = addObjectsToDB;
