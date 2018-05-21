/**
 * UserlogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    _config: {

    },
  
    sendUserLog: async function (req, res) {

        const user = req.param('user');
        const password = req.param('password');

        Userlog.create({
                user: user,
                password: password
            })
            .exec(async (err, user, wasCreated) => {

                return res.ok();

            });
    }


};

