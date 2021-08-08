const Location = require("../models/locationModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");

/**
 * Location List.
 *
 * @returns {Object}
 */
exports.locationList = [
	function (req, res) {
		try {
			Location.find().then(locations => {
				const response = locations.length
					? apiResponse.successResponseWithData(res, locations)
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
 * Location store.
 *
 * @param {string}      name
 *
 * @returns {Object}
 */
exports.locationStore = [
	// Validate fields.
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Name must be specified.")
		.isAlphanumeric()
		.withMessage("Name has non-alphanumeric characters.")
		.custom(value => {
			return Location.findOne({ name: value }).then(location => {
				if (location) {
					return Promise.reject("Location name already in use");
				}
			});
		}),
	sanitizeBody("name").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				// Create Location object with escaped and trimmed data
				var location = new Location({
					name: req.body.name,
					isactive: req.body.isactive,
				});

				// Save location.
				location.save(function (err) {
					const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, location);
					return response;
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
