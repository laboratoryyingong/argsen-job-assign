/**
 * argsen job assign 
 * @author yin_gong<max.g.laboratory@gmail.com>
 */
const fs = require('fs');

module.exports = {
    "PORT": 9000,
    "KEY" : fs.readFileSync(__dirname + '/app/key/encryption/argsen_com.key'),
    "CERT" : fs.readFileSync(__dirname + '/app/key/encryption/ssl-bundle.crt')
}