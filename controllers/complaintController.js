const Complaint = require('../models/complaintModel');
const Property = require('../models/propertyModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');

async function filterQuery(data) {
  try {
    var filterString = {};
    let res = '';
    if (data.fromdate || data.todate) {
      var dateFilter = {};
      if (data.fromdate) {
        dateFilter['$gte'] = new Date(data.fromdate);
      }
      if (data.todate) {
        dateFilter['$lte'] = new Date(data.todate);
      }
      filterString['createdAt'] = dateFilter;
    }

    if (data.search) {
      res = await Property.find(
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
 * Complaint List.
 *
 * @returns {Object}
 */
exports.complaintList = [
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
            sortFilter['createdAt'] = filterData.orderby;
            query = Complaint.find(filterString)
              .populate('property', ['name'])
              .populate('raisedby', ['firstName', 'lastName', 'email', 'phone'])
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          } else {
            query = Complaint.find(filterString)
              .populate('property', ['name'])
              .populate('raisedby', ['firstName', 'lastName', 'email', 'phone'])
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          }
        } else if (filterData.columnname && filterData.orderby) {
          sortFilter['createdAt'] = filterData.orderby;
          query = Complaint.find(filterString)
            .populate('property', ['name'])
            .populate('raisedby', ['firstName', 'lastName', 'email', 'phone'])
            .sort(sortFilter);
        } else {
          query = Complaint.find(filterString)
            .populate('property', ['name'])
            .populate('raisedby', ['firstName', 'lastName', 'email', 'phone']);
        }

        // Execute query and return response
        query.exec(function (err, complaints) {
          if (err) throw new Error(err);
          const response = complaints.length
            ? apiResponse.successResponseWithData(res, complaints)
            : apiResponse.successResponseWithData(res, []);
          return response;
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
        .populate('property', ['name'])
        .populate('raisedby', ['firstName', 'lastName', 'email', 'phone'])
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
  body('description')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Description must be specified.'),
  sanitizeBody('description').escape(),
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
  body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
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
