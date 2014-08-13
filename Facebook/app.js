// { id: 'microsoft',
//   info: [Function],
//   friends: [Function],
//   feed: { write: [Function], get: [Function] },
//   photos: [Function],
//   photoAlbums: [Function] }

var fbapi = require('facebook-api');
var config = require('./config.js');
var client = fbapi.user(config.access_token);

client.get("apple-inc").feed.get(viewback);

var good = [];
var bad = [];
function viewback(err, data) { 
    if(err) { 
        console.log("Error: " + JSON.stringify(err)); 
    } else { 
        // console.log("Data: " + JSON.stringify(data)); 
        for (key in data.data[0]) {
          console.log(key);
        }
        console.log(data.data[0].from);
        console.log(data.data[0].to);
    }
}
