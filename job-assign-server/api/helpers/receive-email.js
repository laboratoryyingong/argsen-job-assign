module.exports = {

    friendlyName: 'receive email',


    description: 'Return a email list.',


    inputs: {

        date: {
            type: 'string',
            example: 'May 20, 2010',
            description: 'receive email since May 20, 2010',
            required: true
        }



    },


    fn: function (inputs, exits) {

        var Imap = require('imap'),
            inspect = require('util').inspect;

        var imap = new Imap({
            user: 'yin.gong.reg@gmail.com',
            password: '1266Mg96',
            host: 'imap.gmail.com',
            port: 993,
            tls: true
        });

        var getStream = require('get-stream');

        imap.once('ready', function () {
            imap.openBox('INBOX', true, function () {
                imap.search(['UNSEEN', ['SINCE', 'May 20, 2017']], function (err, results) {
                    if (err) throw err;
                    var f = imap.fetch(results, {
                        bodies: 'TEXT',
                        struct: true
                    });

                    var returnObj = [];
                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        var messageObj = [];

                        msg.on('body', function (stream, info) {
                            console.log(prefix + 'Body');
                            getStream(stream).then((str) => {
                                console.log(str);
                            });
                            
                        });
                        msg.once('end', function () {
                            returnObj.push(messageObj);
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {

                        console.log('Done fetching all messages!');
                        imap.end();
                        return exits.success(returnObj);
                    });
                });
            });
        });

        imap.once('error', function (err) {
            console.log(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();

    }

};