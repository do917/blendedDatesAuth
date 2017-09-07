const express = require('express');
const fs = require('fs');
const app = express();
const request = require('request');
const einstein = require('./tokenGenerator');
const insta = require('instagram-node').instagram();
// const config = require('./config');

const redirect_uri = 'https://floating-everglades-83969.herokuapp.com/api/instagram/getToken';

insta.use({
  client_id: process.env.instaClientID,
  client_secret: process.env.instaClientSecret
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {  
  res.send('Hello World!');
});

app.post('/api/auth', (req, res) => {
  res.send({
    success: true,
    url: insta.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' })
  });
});

app.get('/api/instagram/getToken', (req, res) => {
  //the instagram-node package performs a final request to exchange the code in the redirect URI for the access token
  insta.authorize_user(req.query.code, redirect_uri, (err, result) => {
    if (err) {
      console.log(err.body);
      res.send('Didn\'t work');
    } else {
      console.log('instagram access token: ' + result.access_token);
      res.redirect(`blendeddates://instaAuth?token=${result.access_token}`);
    }
  });
});

app.get('/api/einstein/getToken', (req, res) => {
  einstein.requestToken(token => {
    res.send({
      token: token
    });
  });
})
