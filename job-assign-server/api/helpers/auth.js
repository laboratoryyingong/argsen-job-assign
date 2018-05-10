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

module.exports = {


  friendlyName: 'Auth',


  description: 'Auth something.',


  inputs: {

    auth_code: {
      type: 'string',
      example: 'OAQABAAIAAADX8GCi6Js6SK82TsD2Pb7rJBVf2o4uOuD0_UfCNpL9EltqWSJRLURp5DueK918-Tz65SAMw9Ne7_3FRVsdPvgn5-3NZpV2VPRZQUeQaKuPi4WvZb099QKNE39A-gdp6lBbWHS6kmlb0XHB1Bz7EmiLU6hwK0EDoTQ4oioYKsRnWQgPPIwwpHxybWKB02UQ_ySp3oqKH7Qe210b9SmN53OlY5FmSJMyUvKSP0YGnxwQkFgnmInl4lo8nIHmAjQ7qjEVltd-nEtZc0KSjNWQozA8bc9KP3waaGHlw8sN4Ey2T_OLkyberjRiGdG-o8Me23J19bNXF7X6u1rJ05XefVx4_VFRD8WPjP9uBQXBxTf1NiJ0Y5QUxWVFYTn0v4e-lnb-cWkYP-vOuv92T3nJ5yau6P-EoUJfSEsZxlrESp3nyEF0kX7jDcv2OjIhqVbkQvQbDtMOl1Vg_6My66TvgaSAeHaPUviRAht2_io-QVh1qtu4N3Sq5ezaAlQiPt7w3TQQDlcAa0on3Nl0S5ruimfLUa16wV2H_v4ZvteoQ07104xrvfUo3G1X8K5sOrcLBza7112NBlGuy-lRvDc_AGRyhsLwyamfO5q9z1gHmkK2vz04vWFwyve8S7U-ARw4yWnshIchn5kquCv_NIxeZAZ78XMgliwwZx8QQpGe4nU2NSAA',
      description: 'Access Code',
      required: true
    }

    
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let result = await oauth2.authorizationCode.getToken({
      code: inputs.auth_code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: process.env.APP_SCOPES
    });
  
    const token = oauth2.accessToken.create(result);
    return exits.success(token.token);

  }


};

