/**
 * EmailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    receive: async function (req, res) {
        const greeting = await sails.helpers.receiveEmail('max');
        return res.json(greeting);
    }


};

