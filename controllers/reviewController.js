const Review = require("../models/reviewModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const constants = require("../constants");

/**
 * Review List.
 *
 * @returns {Object}
 */
exports.reviewList = [
	function (req, res) {
		try {
			Review.find()
				.populate("property", constants.POPULATE_PROPERTY_FIELDS)
				.populate("reviewedby", constants.POPULATE_USER_FIELDS)
				.then(reviews => {
					const response = reviews.length
						? apiResponse.successResponseWithData(res, reviews)
						: apiResponse.successResponseWithData(res, []);
					return response;
				});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Review List by PropertyID.
 *
 * @returns {Object}
 */
exports.reviewListByProperty = [
	function (req, res) {
		try {
			Review.find({ property: req.params.id })
				.populate("property", constants.POPULATE_PROPERTY_FIELDS)
				.populate("reviewedby", constants.POPULATE_USER_FIELDS)
				.then(reviews => {
					const response = reviews.length
						? apiResponse.successResponseWithData(res, reviews)
						: apiResponse.successResponseWithData(res, []);
					return response;
				});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Review store.
 *
 * @param {string}       rating
 * @param {string}       description
 * @param {ObjectId}      reviewedby
 * @param {ObjectId}     property

 *
 * @returns {Object}
 */
exports.reviewStore = [
	// Validate fields.
	body("rating")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Rating must be specified.")
		.isNumeric()
		.withMessage("Rating has non-numeric characters."),
	sanitizeBody("rating").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				// Create Review object with escaped and trimmed data
				const { rating, description, reviewedby, property } = req.body;
				var review = new Review({
					rating,
					description,
					reviewedby,
					property,
				});

				// Save review.
				review.save(function (err) {
					const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, review);
					return response;
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
