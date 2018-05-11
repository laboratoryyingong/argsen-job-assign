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
const jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Refresh token',


  description: '',


  inputs: {

    token: {
      type: 'ref',
      description: 'get token',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    // Do we have an access token cached?
    let token = inputs.token.access_token;

    if (token) {
      // We have a token, but is it expired?
      // Expire 5 minutes early to account for clock differences
      const FIVE_MINUTES = 300000;
      const expiration = new Date(parseFloat(Date.parse(inputs.token.expires_at) - FIVE_MINUTES));

      if (expiration > new Date()) {
        // Token is still good, just return it
        return exits.success(null);
      }
    }

    // Either no token or it's expired, do we have a 
    // refresh token?
    const refresh_token = inputs.token.refresh_token;
    if (refresh_token) {
      const newToken = await oauth2.accessToken.create({ refresh_token: refresh_token }).refresh();

      return exits.success(newToken.token);
    }


  }


};

