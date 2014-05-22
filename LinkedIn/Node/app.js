var credentials = require('./config.js').credentials;

var express = require('express')
  , linkedin_client = require('linkedin-js')('75gqm2e022pkb7', 'LgLblw1N0Pij52i7', 'http://localhost:3003/auth')
  , app = express.createServer(
      express.cookieParser()
    // , express.session({ secret: "string" })
    );
app.use(express.cookieSession({secret:"string"}));
app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
  linkedin_client.getAccessToken(req, res, function (error, token) {
    // will enter here when coming back from linkedin
    req.session.token = token;

    res.render('auth');
  });
});

app.post('/message', function (req, res) {
  linkedin_client.apiCall('POST', '/people/~/shares',
    {
      token: {
        oauth_token_secret: req.session.token.oauth_token_secret
      , oauth_token: req.session.token.oauth_token
      }
    , share: {
        comment: req.param('message')
      , visibility: {code: 'anyone'}
      }
    }
  , function (error, result) {
      res.render('message_sent');
    }
  );
});

app.listen(8080);