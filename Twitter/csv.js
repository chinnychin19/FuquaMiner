var fs = require('fs');
var string = require('string');

function csvWriteStream(outFileName, keyObj) { //file name does not include extension
	var stream = {};
	stream.out = fs.createWriteStream(outFileName+".csv");
	stream.keys = []; //list because ORDER MATTERS!!!
	var headers = "";
	for (var key in keyObj) {
		stream.keys.push(key);
		headers += key + ",";
	}
	headers = headers.slice(0, headers.length - 1) + "\n"; //chop off last comma
	stream.out.write(headers);

	function addRow(obj) {
		var line = "";
		for (var i in stream.keys) {
			var element = obj[stream.keys[i]];
			var safeData = "";
			if (element) {
				safeData = makeCSVSafeElement(element);
			}
			line += safeData + ",";
		}
		line = line.slice(0, line.length - 1) + "\n"; //chop off last comma
		stream.out.write(line);
	}

	stream.addRow = addRow;
	return stream;
}

function csvUpdateStream(outFileName, keyObj) { //file name does not include extension
	var stream = {};
	stream.out = fs.createWriteStream(outFileName+".csv", {"flags":"r+"});
	stream.keys = []; //list because ORDER MATTERS!!!
	for (var key in keyObj) {
		stream.keys.push(key);
	}

	function addRow(obj) {
		var line = "";
		for (var i in stream.keys) {
			var element = obj[stream.keys[i]];
			var safeData = "";
			if (element) {
				safeData = makeCSVSafeElement(element);
			}
			line += safeData + ",";
		}
		line = line.slice(0, line.length - 1) + "\n"; //chop off last comma
		stream.out.write(line);
	}

	stream.addRow = addRow;
	return stream;
}

function makeCSVSafeElement(element) {
	// Special case: for dates, convert them to numbers, so they are sortable
	if (!!Date.parse(element) && typeof element === "string") {
		element = Date.parse(element);
	}
	var str = string(element + "").replaceAll(',', ' ');
	str = string(str).replaceAll('\n', '. ');
	return str;
}

exports.csvWriteStream = csvWriteStream;
exports.csvUpdateStream = csvUpdateStream;
