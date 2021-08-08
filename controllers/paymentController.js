const Transaction = require("../models/transactionModel");
const apiResponse = require("../helpers/apiResponse");

/**
 * Amenity store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.paymentStore = [
	(req, res) => {
		try {
			var transaction = new Transaction({
				charge_id: req.body.id,
				email: req.body.email || req.body.card.name,
				amount: req.body.amount,
			});

			// Save amenity.
			transaction.save(function (err) {
				const response = err
					? apiResponse.ErrorResponse(res, err)
					: apiResponse.successResponseWithData(res, transaction);
				return response;
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
