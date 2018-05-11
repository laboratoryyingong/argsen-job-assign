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

    receive: async function (req, res) {
        const greeting = await sails.helpers.receiveEmail('max');
        return res.json(greeting);
    },

    reveiveArgsen: async function (req, res) {
        const returnObj = await sails.helpers.refreshToken();
        const token = returnObj['token'];

        // let parms = { title: 'Inbox', active: { inbox: true } };
        const accessToken = token.access_token;
        const userName = jwt.decode(token.id_token);

        if (accessToken && userName) {

            // Initialize Graph client
            const client = graph.Client.init({
                authProvider: (done) => {
                    done(null, accessToken);
                }
            });

            // Get the latest newest messages from inbox
            const result = await client
                .api('/me/mailfolders/inbox/messages')
                .top(3)
                // .select('subject,from,receivedDateTime,isRead')
                .select('subject,from,receivedDateTime,isRead,body')
                .orderby('receivedDateTime DESC')
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

            

        } 

        return res.ok();

    },

};

