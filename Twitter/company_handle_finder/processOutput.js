var fs = require('fs');

var screenNames = [];
var failedCompanies = [];

var lines = fs.readFileSync("output.out").toString().trim().split('\n');
for (i in lines) {
	var line = lines[i];
	if (line.substring(0,3) == 'N/A') {
		failedCompanies.push(line.substring("N/A for ".length));
		continue;
	}
	var screenName = line.substring(1+line.indexOf(':'));
	screenNames.push(screenName);
}
fs.writeFileSync("screenNames.in", screenNames.join('\n'));
fs.writeFileSync("failedCompanies.in", failedCompanies.join('\n'));
