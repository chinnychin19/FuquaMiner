// { id: 'microsoft',
//   info: [Function],
//   friends: [Function],
//   feed: { write: [Function], get: [Function] },
//   photos: [Function],
//   photoAlbums: [Function] }


var fbapi = require('facebook-api');
var config = require('./config.js');
var client = fbapi.user(config.access_token);

client.get("microsoft").feed.get(viewback);






function viewback(err, data) { 
    if(err) { 
        console.log("Error: " + JSON.stringify(err)); 
    } else { 
        console.log("Data: " + JSON.stringify(data)); 
    }
}
