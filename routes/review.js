var express = require('express');
const reviewController = require('../controllers/reviewController');

var router = express.Router();

router.get('/', reviewController.reviewList);
router.post('/', reviewController.reviewStore);
router.get('property/:id', reviewController.reviewListByProperty);

module.exports = router;
