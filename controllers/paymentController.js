const Transaction = require('../models/paymentModel');
const apiResponse = require('../helpers/apiResponse');

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
  (req, res) => {
    try {
      var payment = new Payment({
        charge_id: req.body.id,
        email: req.body.email || req.body.card.name,
        amount: req.body.amount,
      });

      // Save amenity.
      payment.save(function (err) {
        const response = err
          ? apiResponse.ErrorResponse(res, err)
          : apiResponse.successResponseWithData(res, payment);
        return response;
      });
    } catch (err) {
      // Throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
