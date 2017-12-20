/**
 * routes for API
 */

const express = require('express');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.get('/test', function(req, res) {
        res.send('test api');
    });

    return api;
})();