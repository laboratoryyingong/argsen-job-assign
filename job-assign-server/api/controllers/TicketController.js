/**
 * TicketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    _config: {

    },

    insertTicket: async function (req, res) {

        const ticket = req.param('ticket');
        let recipients = req.param('recipients');
        const title = req.param('title');
        const comment = req.param('comment');
        const reference = req.param('reference');
        const isEmailAttached = req.param('isEmailAttached');

        Ticket.findOrCreate({
            ticket: ticket
        }, {
                ticket: ticket,
                recipients: JSON.parse(recipients),
                title: title,
                comment: comment,
                reference: reference,
                isEmailAttached: isEmailAttached
            })
            .exec(async (err, user, wasCreated) => {

                return res.ok();

            });
    }

};

