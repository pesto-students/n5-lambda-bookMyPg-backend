const Amenity = require("../models/amenityModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const setParams = require("../helpers/utility");

async function setFilterQuery(data) {
	try {
		var filterString = {};
		if (data.search) {
			filterString["name"] = {
				$regex: ".*" + data.search + ".*",
				$options: "i",
			};
		}
		return filterString;
	} catch (err) {
		throw new Error("Error in query");
	}
}

/**
 * Amenity List.
 *
 * @returns {Object}
 */
exports.amenityList = [
	async function (req, res) {
		try {
			var filterData = req.query;

			await setFilterQuery(req.query).then(filterString => {
				var queryParams = setParams.setSortSkipParams(filterData);

				// Format query based on pagination and sorting parameters
				var query = Amenity.find(filterString)
					.sort(queryParams.sortFilter)
					.skip(queryParams.skip)
					.limit(parseInt(queryParams.limit));

				// Execute query and return response
				query.exec(function (err, amenities) {
					if (amenities.length > 0) {
						Amenity.find(filterString)
							.countDocuments()
							.then(count => {
								return apiResponse.successResponseWithData(
									res,
									amenities,
									count,
								);
							});
					} else {
						return apiResponse.successResponseWithData(res, []);
					}
				});
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Amenity Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.amenityDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res);
		}
		try {
			Amenity.findOne({ _id: req.params.id }).then(amenity => {
				const response =
          amenity !== null
          	? apiResponse.successResponseWithData(res, amenity)
          	: apiResponse.notFoundResponse(res);
				return response;
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Amenity store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.amenityStore = [
	// Validate fields.
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Name must be specified.")
		.custom(value => {
			return Amenity.findOne({ name: value }).then(amenity => {
				if (amenity) {
					return Promise.reject("Amenity name already in use");
				}
			});
		}),
	body("logo").isLength({ min: 1 }).withMessage("Logo must be specified."),
	sanitizeBody("name").escape(),
	//sanitizeBody('logo').escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				// Create Amenity object with escaped and trimmed data
				var amenity = new Amenity({
					name: req.body.name,
					logo: req.body.logo,
					isactive: req.body.isactive,
				});

				// Save amenity.
				amenity.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					return apiResponse.successResponseWithData(res, amenity);
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Amenity disable.
 *
 * @param {string}      id
 *
 *
 * @returns {Object}
 */
exports.amenityDelete = [
	(req, res) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(res, "Invalid ID");
			} else {
				Amenity.findOne({ _id: req.params.id }, function (err, foundAmenity) {
					if (foundAmenity === null) {
						return apiResponse.notFoundResponse(res);
					} else {
						// Disable user.
						var amenity = { isactive: !foundAmenity.isactive };
						Amenity.findByIdAndUpdate(req.params.id, amenity, function (err) {
							const response = err
								? apiResponse.ErrorResponse(res, err)
								: apiResponse.successResponseWithData(res, amenity);
							return response;
						});
					}
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Amenity update.
 *
 * @param {string}      Name
 * @param {string}      Logo
 *
 * @returns {Object}
 */
exports.amenityUpdate = [
	(req, res) => {
		try {
			const errors = validationResult(req);
			var amenity = req.body;
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res);
				} else {
					Amenity.findOne({ _id: req.params.id }, function (err, foundAmenity) {
						if (foundAmenity === null) {
							return apiResponse.notFoundResponse(res);
						} else {
							//update complaint.
							Amenity.findByIdAndUpdate(req.params.id, amenity, function (err) {
								const response = err
									? apiResponse.ErrorResponse(res, err)
									: apiResponse.successResponseWithData(res, amenity);
								return response;
							});
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
