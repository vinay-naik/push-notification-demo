/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function(){
    'use strict';

    var express = require('express');
    var router = express.Router();
    var controller = require('./auth.controller');
    
    //api base url is /api/auth
    router.post('/signup', controller.signup);
    router.post('/login', controller.login);

	module.exports = router;
})();
