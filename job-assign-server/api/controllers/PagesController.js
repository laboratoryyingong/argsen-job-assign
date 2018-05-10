/**
 * PagesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');

module.exports = {

    _config: {},

    homepage: function (req, res){
        return res.view('pages/homepage');
    },

    authorise: async function (req, res) {

        //Get auth code
        let auth_code = req.query.code;

        if (auth_code) {
            let token = await sails.helpers.auth.with({ auth_code: auth_code });
            //save token to json file, use access_token to login & use refresh_token to exchange token;
            let json = JSON.stringify(token);
            fs.writeFile('./token.json', json, 'utf8', function(){
                return res.view('pages/authorise');
            });
        
        }

    },
  

};

