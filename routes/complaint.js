var express = require('express');
const complaintController = require('../controllers/complaintController');
const auth = require('../middlewares/auth');
const role = require('../helpers/roles');

var router = express.Router();

router.get('/', complaintController.complaintList);
router.get('/owner/:id', complaintController.complaintList);
router.get(
  '/:id',
  auth.protect,
  auth.restrictTo(role.Owner),
  complaintController.complaintDetail,
);
router.post('/', auth.protect, complaintController.complaintStore);
router.put(
  '/:id',
  auth.protect,
  auth.restrictTo(role.Owner),
  complaintController.complaintUpdate,
);

module.exports = router;
