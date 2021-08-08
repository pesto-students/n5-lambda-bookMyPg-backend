var express = require("express");
const paymentController = require("../controllers/paymentController");

var router = express.Router();

router.post("/", paymentController.paymentStore);

module.exports = router;
