const Property = require("../models/propertyModel");
const Location = require("../models/locationModel");
const Review = require("../models/reviewModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const constants = require("../constants");
const setParams = require("../helpers/utility");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function setFilterQuery(data, user_id) {
	try {
		var filterString = {};
		let res = "";

		if (user_id != "") {
			filterString["owner"] = ObjectId(user_id);
		} else {
			filterString["isactive"] = true;
		}

		// Filter based on Gender
		if (data.gender) {
			filterString["gender"] = { $in: data.gender.split(",") };
		}

		// Filter based on Rent
		if (data.rent) {
			let rentList = data.rent.split(",").map(Number);
			let rentFilterList = [];
			let rentFilterString = {};
			rentList.map(rent => {
				rentFilterString["rent"] = {
					$lte: constants.RENT_FILTER_CONVENTIONS[rent]["less_than"],
					$gte: constants.RENT_FILTER_CONVENTIONS[rent]["greater_than"],
				};
				rentFilterList.push(rentFilterString);
				rentFilterString = {};
			});
			filterString["$or"] = rentFilterList;
		}

		if (user_id != "") {
			if (data.search) {
				filterString["name"] = {
					$regex: ".*" + data.search + ".*",
					$options: "i",
				};
			}
		}

		// Search based on Location
		else if (data.search) {
			res = await Location.findOne({ name: data.search });

			if (res) {
				filterString["location"] = res._id;
			}
		}

		// Filter based on Ratings
		if (data.rating) {
			res = await Review.aggregate([
				{
					$group: {
						_id: "$property",
						avgRating: { $avg: "$rating" },
					},
				},
				{ $match: { avgRating: { $in: data.rating.split(",").map(Number) } } },
			]);
			if (res) {
				filterString["_id"] = { $in: res };
			}
		}
		return filterString;
	} catch (err) {
		throw new Error("Error in query");
	}
}

async function getReviewAnalysis(property_id) {
	var review_res = {};
	let reviews = [];
	if (property_id) {
		reviews = await Review.find({
			property: property_id,
		}).populate("reviewedby", constants.POPULATE_USER_FIELDS);
		// Find review analysis
		if (reviews.length > 0) {
			var totalDocument = reviews.length;
			var review_analysis = await Review.aggregate([
				{
					$facet: {
						review_percentage: [
							{ $match: { property: ObjectId(property_id) } },
							{
								$group: {
									_id: "$rating",
									count: {
										$sum: 1,
									},
								},
							},
							{
								$project: {
									count: 1,
									percentage: {
										$trunc: [
											{
												$multiply: [
													{ $divide: [100, totalDocument] },
													"$count",
												],
											},
											2,
										],
									},
								},
							},
						],
						avg_ratings: [
							{
								$match: { property: property_id },
							},
							{
								$group: {
									_id: null,
									avgratings: { $avg: { $ifNull: ["$rating", 0] } },
								},
							},
							{ $project: { avgratings: { $trunc: ["$avgratings", 2] } } },
						],
					},
				},
			]);

			if (review_analysis) {
				review_res = {
					reviews: reviews,
					reviewanalysis: review_analysis[0].review_percentage,
					avgratings: review_analysis[0].avg_ratings[0].avgratings,
				};
			}
		}
		return review_res;
	}
}

/**
 * Property List.
 *
 * @returns {Object}
 */
exports.propertyList = [
	async function (req, res) {
		try {
			var filterData = req.query;

			// Check if request from Owner
			var user_id = req.route.path.includes("owner") ? req.params.id : "";

			await setFilterQuery(req.query, user_id).then(filterString => {
				var queryParams = setParams.setSortSkipParams(filterData);
				// Format query based on pagination and sorting parameters
				var query = Property.find(filterString)
					.populate("location", constants.POPULATE_LOCATION_FIELDS)
					.populate("amenities", constants.POPULATE_AMENITY_FIELDS)
					.populate("owner", constants.POPULATE_USER_FIELDS)
					.populate("numreviews")
					.sort(queryParams.sortFilter)
					.skip(queryParams.skip)
					.limit(parseInt(queryParams.limit));

				// Execute query and return response
				query.exec(async function (err, properties) {
					if (err) throw new Error(err);

					if (properties.length > 0) {
						var properties_response = [];
						await Promise.all(
							properties.map(async property => {
								await getReviewAnalysis(property._id).then(result => {
									var final_response = {};
									final_response["propertydata"] = property;
									final_response["reviewdata"] = result;
									properties_response.push(final_response);
								});
							}),
						);

						Property.find(filterString)
							.countDocuments()
							.then(count => {
								return apiResponse.successResponseWithData(
									res,
									properties_response,
									count,
								);
							});
					} else {
						return apiResponse.successResponseWithData(res, []);
					}
				});
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Property Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.propertyDetail = [
	async function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			await getReviewAnalysis(req.params.id).then(result => {
				Property.findOne({ _id: req.params.id })
					.populate("location", constants.POPULATE_LOCATION_FIELDS)
					.populate("amenities", constants.POPULATE_AMENITY_FIELDS)
					.populate("owner", constants.POPULATE_USER_FIELDS)
					.populate("numreviews")
					.then(property => {
						if (property !== null) {
							var final_response = {};
							final_response["propertydata"] = property;
							final_response["reviewdata"] = result;
							return apiResponse.successResponseWithData(res, final_response);
						} else {
							apiResponse.successResponseWithData(res, []);
						}
					});
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Property store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.propertyStore = [
	// Validate fields.
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description must be specified."),
	body("address")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Address must be specified."),
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Name must be specified."),
	sanitizeBody("name").escape(),
	sanitizeBody("description").escape(),
	sanitizeBody("address").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				const {
					name,
					location,
					address,
					description,
					rent,
					totalbeds,
					amenities,
					owner,
					photos,
					gender,
					isactive,
				} = req.body;
				// Create Property object with escaped and trimmed data
				var property = new Property({
					name,
					location,
					address,
					description,
					rent,
					totalbeds,
					amenities,
					owner,
					photos,
					gender,
					isactive,
				});

				// Save property.
				property.save(function (err) {
					const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, property);
					return response;
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Property disable.
 *
 * @param {string}      id
 *
 *
 * @returns {Object}
 */
exports.propertyDelete = [
	(req, res) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(res, "Invalid ID");
			} else {
				Property.findOne({ _id: req.params.id }, function (err, foundProperty) {
					if (foundProperty === null) {
						return apiResponse.notFoundResponse(res);
					} else {
						// Disable property.
						var property = { isactive: !foundProperty.isactive };
						Property.findByIdAndUpdate(req.params.id, property, function (err) {
							const response = err
								? apiResponse.ErrorResponse(res, err)
								: apiResponse.successResponseWithData(res, property);
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
 * Property update.
 *
 * @param {string}      Name
 * @param {string}      Logo
 *
 * @returns {Object}
 */
exports.propertyUpdate = [
	(req, res) => {
		try {
			const errors = validationResult(req);
			var property = req.body;
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res);
				} else {
					Property.findOne(
						{ _id: req.params.id },
						function (err, foundProperty) {
							if (foundProperty === null) {
								return apiResponse.notFoundResponse(res);
							} else {
								//update property.
								Property.findByIdAndUpdate(
									req.params.id,
									property,
									function (err) {
										const response = err
											? apiResponse.ErrorResponse(res, err)
											: apiResponse.successResponseWithData(res, property);
										return response;
									},
								);
							}
						},
					);
				}
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
