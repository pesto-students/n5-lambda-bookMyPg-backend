const Complaint = require('../models/complaintModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
const setParams = require('../helpers/utility');
const constants = require('../constants');

exports.complaintList = [
  async function (req, res) {
    try {
      var filterData = req.query;

      var user_id = req.route.path.includes('owner') ? req.params.id : '';
      await setFilterQuery(req.query, user_id).then(filterString => {
        queryParams = setParams.setSortSkipParams(filterData);

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
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
