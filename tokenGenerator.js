const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('./config');

var private_key = config.einstein.privateKey;
var account_id = config.einstein.accountId;
var reqUrl = 'https://api.einstein.ai/v2/oauth2/token';



// Make the OAuth call to generate a token
module.exports = {
  requestToken: function(callback) {
    // JWT payload
    var rsa_payload = {
      sub: account_id,
      aud: reqUrl
    }

    var rsa_options = {
      header:{
        alg: 'RS256',
        typ: 'JWT'
       },
       expiresIn: '1h'
    }
    
    // Sign the JWT payload
    var assertion = jwt.sign(
      rsa_payload,
      private_key,
      rsa_options
    );


    var options = {
      url: reqUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`
    }

    request.post(options, function(error, response, body) {
      var data = JSON.parse(body);
      console.log('einstein access token', data['access_token']);
      callback(data['access_token']);
    });
  }
}