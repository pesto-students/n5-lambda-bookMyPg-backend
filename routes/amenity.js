var express = require("express");
const amenityController = require("../controllers/amenityController");
const auth = require("../middlewares/auth");
const role = require("../helpers/roles");

var router = express.Router();

router.get("/", auth.protect, amenityController.amenityList);
router.get("/:id", amenityController.amenityDetail);
router.post(
	"/",
	auth.protect,
	auth.restrictTo(role.Admin),
	amenityController.amenityStore,
);

module.exports = router;
