module.exports = {

    friendlyName: 'receive email',


    description: 'Return a email list.',


    inputs: {

        date: {
            type: 'string',
            example: 'May 20, 2010',
            description: 'receive email since May 20, 2010',
            required:true
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

        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }

        imap.once('ready', function () {

            openInbox(function (err, box) {
                if (err) throw err;
                var f = imap.seq.fetch('1:4', {
                    bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                    struct: true
                });
                var returnArr = [];
                f.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);
                    var returnObj = [];
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', function (stream, info) {
                        var buffer = '';
                        stream.on('data', function (chunk) {
                            buffer += chunk.toString('utf8');
                            console.log(buffer)
                        });
                        stream.once('end', function () {
                            returnObj.push(inspect(Imap.parseHeader(buffer)));
                            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                        });
                    });
                    msg.once('attributes', function (attrs) {
                        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    });
                    msg.once('end', function () {
                        returnArr.push(returnObj);
                        console.log(prefix + 'Finished');
                    });
                });
                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function () {
                    return exits.success(returnArr);
                    console.log('Done fetching all messages!');
                    imap.end();
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