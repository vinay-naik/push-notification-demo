(function(){
    'use strict';

    var express = require('express');
    var router = express.Router();
    var controller = require('./notification.controller');
    var auth = require('../auth/auth.controller');
	
    router.get('/', auth.isAuthenticated, controller.fetch);
    router.put('/', auth.isAuthenticated, controller.update);

	module.exports = router;
})();
