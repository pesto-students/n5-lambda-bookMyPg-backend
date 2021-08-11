var express = require('express');
const propertyController = require('../controllers/propertyController');
const auth = require('../middlewares/auth');
const role = require('../helpers/roles');

var router = express.Router();

router.get('/', propertyController.propertyList);
router.get('/owner/:id', propertyController.propertyListByOwner);
router.get('/', propertyController.propertyList);
router.get('/:id', propertyController.propertyDetail);
router.post(
  '/',
  auth.protect,
  auth.restrictTo(role.Owner),
  propertyController.propertyStore,
);

module.exports = router;
