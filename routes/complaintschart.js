var express = require('express');
const complaintschartController = require('../controllers/complaintschartController');

var router = express.Router();

router.get('/', complaintschartController.complaintsList);

module.exports = router;
