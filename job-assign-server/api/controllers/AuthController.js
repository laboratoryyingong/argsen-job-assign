/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


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

module.exports = {

    getCode: async function (req, res) {
        const returnVal = oauth2.authorizationCode.authorizeURL({
            redirect_uri: process.env.REDIRECT_URI,
            scope: process.env.APP_SCOPES
        });

        return res.redirect(returnVal);

    },

    refreshToken: function (req, res){

        //Get current token
        let token = null;

        fs.readFile('./token.json', 'utf8', async function (err, data) {
            token = JSON.parse(data);
            let newToken = await sails.helpers.refreshToken.with({token: token});

            if(newToken){
                let json = JSON.stringify(newToken);
                fs.writeFile('./token.json', json, 'utf8', function(){
                    return res.json({'is_refresh': true});
                });
            }else{
                return res.json({'is_refresh': false});
            }

        });

    }

};

