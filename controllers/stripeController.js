const Transaction = require("../models/transactionModel");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

/**
 * Amenity store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.stripeStore = [
	(req, res) => {
		try {
			var transaction = new Transaction({
				trans_id: req.body.id,
				email: req.body.email || req.body.card.name,
				amount: req.body.amount,
			});

			// Save amenity.
			transaction.save(function (err) {
				if (err) {
					return apiResponse.ErrorResponse(res, err);
				}
				let transData = {
					_id: transaction._id,
					email: transaction.name,
				};
				return apiResponse.successResponseWithData(
					res,
					"Transaction add Success.",
					transData,
				);
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
