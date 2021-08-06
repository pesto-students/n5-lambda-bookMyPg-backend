var express = require('express');
const emailController = require('../controllers/emailController');
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

router.post('/', emailController.emailSend);

module.exports = router;
