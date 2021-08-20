const Complaint = require("../models/complaintModel");
const Property = require("../models/propertyModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const setParams = require("../helpers/utility");
const constants = require("../constants");

async function setFilterQuery(data, user_id) {
	try {
		var filterString = {};
		let res = "";

		if (user_id != "") {
			res = await Property.find({ owner: user_id }, { _id: 1 });

			if (res) {
				filterString["property"] = { $in: res };
			}
		}

		if (data.from_date || data.to_date) {
			var dateFilter = {};
			if (data.from_date) {
				dateFilter["$gte"] = new Date(data.from_date);
			}
			if (data.to_date) {
				dateFilter["$lte"] = new Date(data.to_date);
			}
			filterString["createdAt"] = dateFilter;
		}

		if (data.search) {
			res = await Property.find(
				{
					name: {
						$regex: ".*" + data.search + ".*",
						$options: "i",
					},
				},
				{ _id: 1 },
			);

			if (res) {
				filterString["property"] = { $in: res };
			}
		}
		return filterString;
	} catch (err) {
		throw new Error("Error in query");
	}
}

/**
 * Complaint List By Owner.
 *
 * @returns {Object}
 */
exports.complaintList = [
	async function (req, res) {
		try {
			var filterData = req.query;

			//Check if request from Owner
			var user_id = req.route.path.includes("owner") ? req.params.id : "";
			await setFilterQuery(req.query, user_id).then(filterString => {
				var queryParams = setParams.setSortSkipParams(filterData);

				// Format query based on pagination and sorting parameters
				var query = Complaint.find(filterString)
					.populate("property", constants.POPULATE_PROPERTY_FIELDS)
					.populate("raisedby", constants.POPULATE_USER_FIELDS)
					.sort(queryParams.sortFilter)
					.skip(queryParams.skip)
					.limit(parseInt(queryParams.limit));

				// Execute query and return response
				query.exec(function (err, complaints) {
					if (err) throw new Error(err);

					if (complaints.length > 0) {
						Complaint.find(filterString)
							.countDocuments()
							.then(count => {
								return apiResponse.successResponseWithData(
									res,
									complaints,
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
 * Complaint Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.complaintDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res);
		}
		try {
			Complaint.findOne({ _id: req.params.id })
				.populate("property", constants.POPULATE_PROPERTY_FIELDS)
				.populate("raisedby", constants.POPULATE_USER_FIELDS)
				.then(complaint => {
					const response =
            complaint !== null
            	? apiResponse.successResponseWithData(res, complaint)
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
 * Complaint store.
 *
 * @param {string}      rating
 * @param {string}      description
 *
 * @returns {Object}
 */
exports.complaintStore = [
	// Validate fields.
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description must be specified."),
	sanitizeBody("description").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				// Create Complaint object with escaped and trimmed data
				var complaint = new Complaint({
					description: req.body.description,
					raisedby: req.body.raisedby,
					property: req.body.property,
					remark: req.body.remark,
				});

				// Save complaint.
				complaint.save(function (err) {
					const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, complaint);
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
 * Complaint update.
 *
 * @param {string}      status
 *
 *
 * @returns {Object}
 */
exports.complaintUpdate = [
	body("status", "Status must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var complaint = req.body;
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res);
				} else {
					Complaint.findById(req.params.id, function (err, foundComplaint) {
						if (foundComplaint === null) {
							return apiResponse.notFoundResponse(res);
						} else {
							//update complaint.
							Complaint.findByIdAndUpdate(
								req.params.id,
								complaint,
								function (err) {
									const response = err
										? apiResponse.ErrorResponse(res, err)
										: apiResponse.successResponseWithData(res, complaint);
									return response;
								},
							);
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
