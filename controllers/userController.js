const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const jwt = require("jsonwebtoken");
const constants = require("../constants");
const setParams = require("../helpers/utility");

async function setFilterQuery(data, user_id) {
	try {
		var filterString = {};
		if (user_id != "") {
			var res = await Property.find({ owner: user_id }, { _id: 1 });
			if (res) {
				filterString["property"] = { $in: res };
			}
		}

		if (data.type) {
			filterString["role"] = data.type;
		}

		if (data.from_date || data.to_date) {
			var dateFilter = {};
			if (data.from_date) {
				dateFilter["$gte"] = new Date(data.from_date);
			}
			if (data.to_date) {
				dateFilter["$lte"] = new Date(data.to_date);
			}
			user_id != ""
				? (filterString["onboardedAt"] = dateFilter)
				: (filterString["createdAt"] = dateFilter);
		}

		if (data.search) {
			// searchString = data.search.split(' ');
			filterString["$expr"] = {
				$regexMatch: {
					input: { $concat: ["$firstName", " ", "$lastName"] },
					regex: ".*" + data.search + ".*",
					options: "i",
				},
			};
		}
		return filterString;
	} catch (err) {
		throw new Error("Error in query");
	}
}

/**
 * User List.
 *
 * @returns {Object}
 */
exports.userList = [
	async function (req, res) {
		try {
			var filterData = req.query;

			//Check if request from Owner
			var user_id = req.route.path.includes("owner") ? req.params.id : "";

			await setFilterQuery(req.query, user_id).then(filterString => {
				var queryParams = setParams.setSortSkipParams(filterData);
				// Format query based on pagination and sorting parameters
				var query = User.find(filterString)
					.populate("property", constants.POPULATE_PROPERTY_FIELDS)
					.sort(queryParams.sortFilter)
					.skip(queryParams.skip)
					.limit(parseInt(queryParams.limit));

				// Execute query and return response
				query.exec(function (err, users) {
					if (err) throw new Error(err);
					if (users.length > 0) {
						User.find(filterString)
							.countDocuments()
							.then(count => {
								return apiResponse.successResponseWithData(res, users, count);
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
 * User Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			User.findOne({ _id: req.params.id })
				.populate("property", constants.POPULATE_PROPERTY_FIELDS)
				.then(user => {
					const response =
            user !== null
            	? apiResponse.successResponseWithData(res, user)
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
 * User Detail by Email.
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.userDetailbyEmail = [
	function (req, res) {
		if (!req.params.email) {
			return apiResponse.validationErrorWithData(res, "Email is missing");
		}
		try {
			User.findOne({ email: req.params.email })
				.populate("property", constants.POPULATE_PROPERTY_FIELDS)
				.then(user => {
					const {
						_id,
						firstName,
						lastName,
						email,
						phone,
						role,
						isactive,
						property,
						image,
					} = user;
					if (user !== null) {
						// Generate token
						const token = jwt.sign(
							{ _id, email, role },
							process.env.JWT_SECRET_KEY,
						);
						const userData = {
							_id,
							firstName,
							lastName,
							email,
							phone,
							role,
							isactive,
							property,
							token,
							image,
						};
						return apiResponse.successResponseWithData(res, userData);
					} else {
						return apiResponse.notFoundResponse(res);
					}
				});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * User store.
 *
 * @param {string}      firstname
 * @param {string}      lastname
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.userStore = [
	// Validate fields.
	body("firstName")
		.isLength({ min: 1 })
		.trim()
		.withMessage("First name must be specified.")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters."),
	body("lastName")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Last name must be specified.")
		.isAlphanumeric()
		.withMessage("Last name has non-alphanumeric characters."),
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address.")
		.custom(value => {
			return User.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("phone").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				const { firstName, lastName, email, role, phone, onboardedAt, image } =
          req.body;
				// Create User object with escaped and trimmed data
				var user = new User({
					firstName,
					lastName,
					email,
					phone,
					role,
					image,
					onboardedAt,
				});

				// Save user.
				user.save(function (err) {
					const response = err
						? apiResponse.ErrorResponse(res, err)
						: apiResponse.successResponseWithData(res, user);
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
 * User disable.
 *
 * @param {string}      id
 *
 *
 * @returns {Object}
 */
exports.userDelete = [
	(req, res) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(res, "Invalid ID");
			} else {
				User.findOne({ _id: req.params.id }, function (err, foundUser) {
					if (foundUser === null) {
						return apiResponse.notFoundResponse(res);
					} else {
						// Disable user.
						var user = { isactive: !foundUser.isactive };
						User.findByIdAndUpdate(req.params.id, user, function (err) {
							const response = err
								? apiResponse.ErrorResponse(res, err)
								: apiResponse.successResponseWithData(res, user);
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
 * User update.
 *
 * @param {string}      id
 *
 *
 * @returns {Object}
 */
exports.userUpdate = [
	// sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = req.body;
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, errors.array());
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res);
				} else {
					User.findById(req.params.id, function (err, foundUser) {
						if (foundUser === null) {
							return apiResponse.notFoundResponse(res);
						} else {
							// Update user.
							User.findByIdAndUpdate(req.params.id, user, function (err) {
								const response = err
									? apiResponse.ErrorResponse(res, err)
									: apiResponse.successResponseWithData(res, user);
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
