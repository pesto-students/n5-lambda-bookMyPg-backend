const Complaint = require('../models/complaintModel');
const apiResponse = require('../helpers/apiResponse');
const setParams = require('../helpers/utility');

exports.chartData = [
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
                return apiResponse.successResponseWithData(count);
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

  async function (req, res) {
    try {
      var filterData = req.query;

      var user_id = req.route.path.includes('admin') ? req.params.id : '';
      await setFilterQuery(req.query, user_id).then(filterString => {
        queryParams = setParams.setSortSkipParams(filterData);

        query.exec(function (err, complaints) {
          if (err) throw new Error(err);

          if (complaints.length > 0) {
            Complaint.find(filterString)
              .countDocuments()
              .then(count => {
                return apiResponse.successResponseWithData(count);
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
