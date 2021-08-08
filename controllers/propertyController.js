const Property = require("../models/propertyModel");
const Location = require("../models/locationModel");
const Review = require("../models/reviewModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");

async function filterQuery(data) {
	try {
		var filterString = {};
		let res = "";

		if (data.gender) {
			let genderList = data.gender.split(",");

			filterString["gender"] = { $in: genderList };
		}
		if (data.rent) {
			let rentList = data.rent.split(",").map(Number);
			let rentFilterList = [];
			let rentFilterString = {};
			rentList.map(rent => {
				if (rent === 0) {
					rentFilterString["rent"] = { $lt: 10000, $gte: 0 };
					rentFilterList.push(rentFilterString);
					rentFilterString = {};
				} else if (rent === 1) {
					rentFilterString["rent"] = { $lt: 15000, $gte: 10000 };
					rentFilterList.push(rentFilterString);
					rentFilterString = {};
				} else {
					rentFilterString["rent"] = { $gte: 15000 };
					rentFilterList.push(rentFilterString);
					rentFilterString = {};
				}
			});

			filterString["$or"] = rentFilterList;
		}
		if (data.search) {
			res = await Location.findOne({ name: data.search });

			if (res) {
				filterString["location"] = res._id;
			}
		}

		if (data.ratings) {
			let ratingsList = data.ratings.split(",").map(Number);

			res = await Review.distinct("property", {
				rating: { $in: ratingsList },
			});
			if (res) {
				filterString["_id"] = { $in: res };
			}
		}

		return filterString;
	} catch (err) {
		throw new Error("Error in query");
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
			if (filterData.orderby) {
				if (filterData.orderby == "dsc") {
					filterData["orderby"] = -1;
				} else {
					filterData["orderby"] = 1;
				}
			}

			await filterQuery(req.query).then(filterString => {
				let sortFilter = {};
				var query = "";
				// Based on query string parameters format query
				if (filterData.pagenumber && filterData.countperpage) {
					if (filterData.columnname && filterData.orderby) {
						sortFilter[filterData.columnname] = filterData.orderby;
						query = Property.find(filterString)
							.populate("location", ["name"])
							.populate("amenities", ["name", "logo"])
							.populate("owner", ["firstName", "lastName"])
							.populate("numreviews")
							.sort(sortFilter)
							.skip(
								(filterData.pagenumber - 1) * parseInt(filterData.countperpage),
							)
							.limit(parseInt(filterData.countperpage));
					} else {
						query = Property.find(filterString)
							.populate("location", ["name"])
							.populate("amenities", ["name", "logo"])
							.populate("owner", ["firstName", "lastName"])
							.populate("numreviews")
							.skip(
								(filterData.pagenumber - 1) * parseInt(filterData.countperpage),
							)
							.limit(parseInt(filterData.countperpage));
					}
				} else if (filterData.columnname && filterData.orderby) {
					sortFilter[filterData.columnname] = filterData.orderby;
					query = Property.find(filterString)
						.populate("location", ["name"])
						.populate("amenities", ["name", "logo"])
						.populate("owner", ["firstName", "lastName"])
						.populate("numreviews")
						.sort(sortFilter);
				} else {
					query = Property.find(filterString)
						.populate("location", ["name"])
						.populate("amenities", ["name", "logo"])
						.populate("owner", ["firstName", "lastName"])
						.populate("numreviews");
				}

				// Execute query and return response
				query.exec(function (err, properties) {
					if (err) throw new Error(err);
					const response = properties.length
						? apiResponse.successResponseWithData(res, properties)
						: apiResponse.successResponseWithData(res, []);
					return response;
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
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			Property.findOne({ _id: req.params.id })
				.populate("location", ["name"])
				.populate("amenities", ["name", "logo"])
				.populate("owner", ["firstName", "lastName"])
				.populate("numreviews")
				.then(property => {
					const response =
            property !== null
            	? apiResponse.successResponseWithData(res, property)
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
