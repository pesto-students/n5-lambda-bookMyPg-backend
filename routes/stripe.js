var express = require("express");
const stripeController = require("../controllers/stripeController");
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

// router.get('/', stripeController.amenityList);
// router.get('/:id', stripeController.amenityDetail);
router.post("/", stripeController.stripeStore);

module.exports = router;
