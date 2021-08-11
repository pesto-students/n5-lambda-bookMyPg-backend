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

/**
 * Payment List.
 *
 * @returns {Object}
 */
exports.paymentList = [
  async function (req, res) {
    try {
      var filterData = req.query;
      if (filterData.orderby) {
        if (filterData.orderby == 'dsc') {
          filterData['orderby'] = -1;
        } else {
          filterData['orderby'] = 1;
        }
      }
      await filterQuery(req.query).then(filterString => {
        let sortFilter = {};
        var query = '';
        // Based on query string parameters format query
        if (filterData.pagenumber && filterData.countperpage) {
          if (filterData.columnname && filterData.orderby) {
            sortFilter[filterData.columnname] = filterData.orderby;
            query = Payment.find(filterString)
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          } else {
            query = Payment.find(filterString)
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          }
        } else if (filterData.columnname && filterData.orderby) {
          sortFilter[filterData.columnname] = filterData.orderby;
          query = Payment.find(filterString).sort(sortFilter);
        } else {
          query = Payment.find(filterString);
        }

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
