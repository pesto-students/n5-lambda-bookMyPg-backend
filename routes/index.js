var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/health", function (req, res) {
	res.json({ status: "OK" });
});

module.exports = router;
