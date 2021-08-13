var express = require("express");
const reviewController = require("../controllers/reviewController");

var router = express.Router();

router.post("/", reviewController.reviewStore);
router.get("/property/:id", reviewController.reviewListByProperty);
router.get("/", reviewController.reviewList);

module.exports = router;
