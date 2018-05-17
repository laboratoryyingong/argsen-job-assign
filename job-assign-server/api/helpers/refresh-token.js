const env = require('dotenv').config();
const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
const oauth2 = require('simple-oauth2').create(credentials);
const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = {


  friendlyName: 'Refresh token',


  description: '',


  inputs: {

    // token: {
    //   type: 'ref',
    //   description: 'get token',
    //   required: true
    // }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let token = null;
    let newToken = null;
    let is_new = true;
    let data = await readFile('./token.json', 'utf8'); //Get current token
    token = JSON.parse(data);

    // We have a token, but is it expired?
    // Expire 5 minutes early to account for clock differences
    const FIVE_MINUTES = 300000;
    const expiration = new Date(parseFloat(Date.parse(token.expires_at) - FIVE_MINUTES));

    if (expiration > new Date()) {
      // Token is still good, just return it
      newToken = token;
      is_new = false;
    } else {
      // Either no token or it's expired, do we have a 
      // refresh token?
      const refresh_token = token.refresh_token;
      if (refresh_token) {
        newToken = await oauth2.accessToken.create({ refresh_token: refresh_token }).refresh();
      }
      is_new = true;
    }

    if (is_new) {
      await writeFile('./token.json', JSON.stringify(newToken), 'utf8');
      return exits.success({
        'is_refresh': true,
        'message': 'new token has been exchanged,thanks!',
        'token': newToken
      });
    } else {
      exits.success({
        'is_refresh': false,
        'message': 'current token has not expired, will continue use.',
        'token': newToken
      });
    }

  }


};

