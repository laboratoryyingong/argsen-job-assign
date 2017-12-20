/**
 * routes for index and partials
 */

const express = require('express');

module.exports = (function() {
    'use strict';
    var router = express.Router();

    router.get('/', function(req, res) {
        res.send('Home');
    });

    return router;    
})();