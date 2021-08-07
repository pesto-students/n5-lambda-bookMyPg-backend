const Complaint = require('../models/complaintModel');
const Property = require('../models/propertyModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// User Schema
function ComplaintData(data) {
  this.id = data._id;
  this.status = data.status;
  this.description = data.description;
  this.raisedby = data.raisedby;
  this.property = data.property;
  this.isactive = data.isactive;
}

async function filterQuery(data) {
  try {
    var filterString = {};
    let res = '';
    if (data.fromdate && data.todate) {
      filterString['createdAt'] = [
        { $gte: new Date(data.fromdate) },
        { $lte: new Date(data.todate) },
      ];
    } else if (data.fromdate) {
      filterString['createdAt'] = {
        $gte: new Date(data.fromdate),
      };
    } else if (data.todate) {
      filterString['createdAt'] = {
        $lte: new Date(data.todate),
      };
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
    console.log('Error in query');
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
          if (err) console.log(err);
          if (complaints) {
            if (complaints.length > 0) {
              return apiResponse.successResponseWithData(
                res,
                'Operation success',
                complaints,
              );
            } else {
              return apiResponse.successResponseWithData(
                res,
                'Operation success',
                [],
              );
            }
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
 * Complaint Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.complaintDetail = [
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid ID');
    }
    try {
      Complaint.findOne({ _id: req.params.id })
        .populate('property', ['name'])
        .populate('raisedby', ['firstName', 'lastName', 'email', 'phone'])
        .then(complaint => {
          if (complaint !== null) {
            let complaintData = new ComplaintData(complaint);
            return apiResponse.successResponseWithData(
              res,
              'Operation success',
              complaintData,
            );
          } else {
            return apiResponse.notFoundResponse(
              res,
              'No record found with this ID',
            );
          }
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
        return apiResponse.validationErrorWithData(
          res,
          'Validation Error.',
          errors.array(),
        );
      } else {
        // Create Complaint object with escaped and trimmed data
        var complaint = new Complaint({
          description: req.body.description,
          raisedby: req.body.raisedby,
          property: req.body.property,
        });

        // Save complaint.
        complaint.save(function (err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          let complaintData = {
            _id: complaint._id,
            description: complaint.description,
            raisedby: complaint.raisedby,
            property: complaint.property,
            status: complaint.status,
          };
          return apiResponse.successResponseWithData(
            res,
            'Complaint add Success.',
            complaintData,
          );
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
        return apiResponse.validationErrorWithData(
          res,
          'Validation Error.',
          errors.array(),
        );
      } else {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return apiResponse.validationErrorWithData(
            res,
            'Invalid Error.',
            'Invalid ID',
          );
        } else {
          Complaint.findById(req.params.id, function (err, foundComplaint) {
            if (foundComplaint === null) {
              return apiResponse.notFoundResponse(
                res,
                'Complaint does not exist with this id',
              );
            } else {
              //update complaint.
              Complaint.findByIdAndUpdate(
                req.params.id,
                complaint,
                function (err) {
                  if (err) {
                    return apiResponse.ErrorResponse(res, err);
                  } else {
                    let complaintData = new ComplaintData(complaint);
                    return apiResponse.successResponseWithData(
                      res,
                      'Complaint update Success.',
                      complaintData,
                    );
                  }
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
