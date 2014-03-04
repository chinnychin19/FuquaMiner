exports.TIME_SECOND = 1000;
exports.TIME_MINUTE = 60 * exports.TIME_SECOND;
exports.TIME_HOUR = 60 * exports.TIME_MINUTE;
exports.TIME_DAY = 24 * exports.TIME_HOUR;
exports.TIME_WEEK = 7 * exports.TIME_DAY;

exports.KEY_OBJ = {
	"screen_name":null,
	"id_str":null,
	"text":null,
	"created_at":null,
	"retweet_count":null,
	"favorite_count":null,
	"truncated":null,
	"in_reply_to_user_id_str":null,
	"in_reply_to_status_id_str":null,
	"geo":null,
	"possibly_sensitive":null,
	"place":null,
	"in_reply_to_screen_name":null,
	"source":null,
}

exports.DEFAULT_NUM_TWEETS = 100000;

// TODO: make these real values
exports.RATE_LIMIT = 10;
exports.RATE_PERIOD = 60*exports.TIME_SECOND;
