const Payment = require('../models/paymentModel');
const apiResponse = require('../helpers/apiResponse');
const setParams = require('../helpers/utility');
const constants = require('../constants');

async function setFilterQuery(data, type, user_id) {
  try {
    var filterString = {};

    if (data.from_date || data.to_date) {
      var dateFilter = {};
      if (data.from_date) {
        dateFilter['$gte'] = new Date(data.from_date);
      }
      if (data.to_date) {
        dateFilter['$lte'] = new Date(data.to_date);
      }
      filterString['createdAt'] = dateFilter;
    }

    if (data.search) {
      var res = await Property.find(
        {
          name: {
            $regex: '.*' + data.search + '.*',
            $options: 'i',
          },
        },
        { _id: 1 },
      );

      if (res) {
        filterString['property'] = { $in: res };
      }
    }
    return filterString;
  } catch (err) {
    throw new Error('Error in query');
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

      await setFilterQuery(req.query).then(filterString => {
        queryParams = setParams.setSortSkipParams(filterData);
        // Format query based on pagination and sorting parameters
        var query = Payment.find(filterString)
          .populate('property', constants.POPULATE_PROPERTY_FIELDS)
          .populate('raisedby', constants.POPULATE_USER_FIELDS)
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
