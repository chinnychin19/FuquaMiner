var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
function addObjectsToDB(connectURI, collectionName, data) { // data is a list of JSON objects
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			console.log(err);
		}

		var numSent = 0;
		var collection = db.collection(collectionName);
		for (var i = 0; i < data.length; i++) { // for each obj in the data list
			var obj = data[i];
			collection.insert(obj, function (err, docs) { // make an async call to add the current object
				numSent++;
				if (err) {
					throw err; // memory error? repeat key? Hopefully this won't happen.
				}
				if (numSent == data.length) { // report when all db additions complete
					// db.close();
					console.log("All objects added from list of length "+data.length);
				}
			});
		}
	})
}

exports.addObjectsToDB = addObjectsToDB;
