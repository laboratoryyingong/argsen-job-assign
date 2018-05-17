/**
 * EmailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const graph = require('@microsoft/microsoft-graph-client');
const jwt = require('jsonwebtoken');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    receiveEmail: async function (req, res) {
        let returnObj = await sails.helpers.refreshToken();
        let token = returnObj['token'];

        // let parms = { title: 'Inbox', active: { inbox: true } };
        let accessToken = token.access_token;
        let userName = jwt.decode(token.id_token);

        if (accessToken && userName) {

            // Initialize Graph client
            let client = graph.Client.init({
                authProvider: (done) => {
                    done(null, accessToken);
                }
            });

            // get startDateTime five days ago  
            startDateTime = formatDate(new Date() - 5*24*60*60*1000); 

            // Get the latest newest messages from inbox
            let result = await client
                .api('/me/mailfolders/inbox/messages')
                // .select('subject,from,receivedDateTime,isRead')
                .select('subject,from,receivedDateTime,isRead,body')
                .orderby('receivedDateTime DESC')
                .filter("receivedDateTime ge " + startDateTime)
                .get();

            for (let i in result['value']) {

                //write to database
                let item = result['value'][i];

                Email.findOrCreate({
                    emailId: item.id
                }, {
                        emailId: item.id,
                        receivedDateTime: item.receivedDateTime,
                        subject: item.subject,
                        isRead: item.isRead,
                        body: item.body,
                        from: item.from
                    })
                    .exec(async (err, user, wasCreated) => {

                    });
            }

            function formatDate(unix_timestamp) {
                var d = new Date(unix_timestamp),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            

        } 

        return res.ok();

    },

    getEmail: async function (req, res) {

        //build up a pagination system
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;

        let email = await Email.find({
            select: ['from','subject','receivedDateTime', 'isRead'],
            limit: limit, 
            skip: skip
        });

        return res.json(email);

    },

    getEmailContentById: async function (req, res){

        const id = req.query.id;

        let emailConent = await Email.find({ 
            where: { id: id },
            select: ['body'],
        })

        return res.json(emailConent);
    }



};

