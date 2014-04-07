var fs = require('fs');


fs.readFile('../screen_names.in', function(err, data) {
	var screen_names = data.toString().trim().split('\n');
	var set = {};
	screen_names.forEach(function(element) {
		var screen_name = element.trim();
		if (set[screen_name]) {
			console.log(screen_name);
		}
		set[screen_name] = true;
	});
	fs.readFile('../screen_names_already_scraped.in', function(err, data) {
		var screen_names = data.toString().trim().split('\n');
		screen_names.forEach(function(element) {
			var screen_name = element.trim();
			if (set[screen_name]) {
				console.log(screen_name);
			}
			set[screen_name] = true;
		});
	});
});
