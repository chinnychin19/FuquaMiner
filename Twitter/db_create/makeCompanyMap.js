var fs = require('fs');

var lines = fs.readFileSync('companyMap.in').toString().trim().split('\n');
var obj = {};
for (i in lines) {
	var line = lines[i];
	var key = line.substring(1+line.indexOf(':'));
	var value = line.substring(0,line.indexOf(':'));
	obj[key] = value;
}

var output = "exports.companyMap = " + JSON.stringify(obj);
fs.writeFileSync('companyMap.js', output);
