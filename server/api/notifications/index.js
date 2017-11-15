/**
 * Created by Vinay Naik on 14/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function(){
    'use strict';

    var express = require('express');
    var router = express.Router();
    var controller = require('./notification.controller');
    var auth = require('../auth/auth.controller');
    
    // api base url is /api/notification
    router.get('/', auth.isAuthenticated, controller.fetch);
    router.put('/', auth.isAuthenticated, controller.update);

	module.exports = router;
})();
