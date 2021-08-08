var express = require("express");
const locationController = require("../controllers/locationController");

var router = express.Router();

router.get("/", locationController.locationList);
router.post("/", locationController.locationStore);

module.exports = router;
