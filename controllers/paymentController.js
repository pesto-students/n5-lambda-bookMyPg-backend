const Payment = require("../models/paymentModel");
const Property = require("../models/propertyModel");
const apiResponse = require("../helpers/apiResponse");
const setParams = require("../helpers/utility");
const constants = require("../constants");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const templateText = require("../helpers/templateText");
const mailer = require("../helpers/mailer");

async function setFilterQuery(data, user_id) {
	try {
		var filterString = {};
		if (user_id) {
			filterString["raisedby"] = user_id;
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
			var res = await Property.find(
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
 * Payment store.
 *
 * @param {string}      charge_id
 * @param {string}      email
 * @param {number}      amount
 *
 * @returns {Object}
 */
exports.paymentStore = [
	// Validate fields.
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified."),
	body("charge_id")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Charge_id must be specified."),
	body("raisedby")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Raisedby must be specified."),
	body("amount")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Amount must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("charge_id").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				// Create Payment object with escaped and trimmed data
				const { email, charge_id, amount, raisedby, property } = req.body;
				// Create Property object with escaped and trimmed data
				var payment = new Payment({
					email,
					charge_id,
					amount,
					raisedby,
					property,
				});

				// Save payment.
				payment.save(function (err) {
					/*const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, payment);*/
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					var emailReplacements = templateText.paymentTemplate(req.body);
					mailer
						.send(payment.email, req.body.owneremail, emailReplacements)
						.then(function () {
							return apiResponse.successResponseWithData(res, payment);
						});
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
/**
 * Payment List.
 *
 * @returns {Object}
 */
exports.paymentList = [
	async function (req, res) {
		try {
			var filterData = req.query;

			await setFilterQuery(req.query, req.params.id).then(filterString => {
				var queryParams = setParams.setSortSkipParams(filterData);
				// Format query based on pagination and sorting parameters
				var query = Payment.find(filterString)
					.populate("property", constants.POPULATE_PROPERTY_FIELDS)
					.populate("raisedby", constants.POPULATE_USER_FIELDS)
					.sort(queryParams.sortFilter)
					.skip(queryParams.skip)
					.limit(parseInt(queryParams.limit));

				// Execute query and return response
				query.exec(function (err, payments) {
					if (payments.length > 0) {
						Payment.find(filterString)
							.countDocuments()
							.then(count => {
								return apiResponse.successResponseWithData(
									res,
									payments,
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
