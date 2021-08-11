const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const jwt = require('jsonwebtoken');
const constants = require('../constants');

async function filterQuery(data) {
  try {
    var filterString = {};
    if (data.type) {
      if (data.type === 'tenant') {
        filterString['property'] = { $exists: true };
      }
    }
    if (data.fromdate || data.todate) {
      var dateFilter = {};
      if (data.fromdate) {
        dateFilter['$gte'] = new Date(data.fromdate);
      }
      if (data.todate) {
        dateFilter['$lte'] = new Date(data.todate);
      }
      filterString['onboardedAt'] = dateFilter;
    }

    if (data.search) {
      searchString = data.search.split(' ');
      filterString['$expr'] = {
        $regexMatch: {
          input: { $concat: ['$firstName', ' ', '$lastName'] },
          regex: '.*' + data.search + '.*',
          options: 'i',
        },
      };
    }

    return filterString;
  } catch (err) {
    throw new Error('Error in query');
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
            sortFilter['onboardedAt'] = filterData.orderby;
            query = User.find(filterString)
              .populate('property', ['name'])
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          } else {
            query = User.find(filterString)
              .populate('property', ['name'])
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          }
        } else if (filterData.columnname && filterData.orderby) {
          sortFilter['onboardedAt'] = filterData.orderby;
          query = User.find(filterString)
            .populate('property', ['name'])
            .sort(sortFilter);
        } else {
          query = User.find(filterString).populate('property', ['name']);
        }

        // Execute query and return response
        query.exec(function (err, properties) {
          if (err) throw new Error(err);
          const response = properties.length
            ? apiResponse.successResponseWithData(res, properties)
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
 * User Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userDetail = [
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid ID');
    }
    try {
      User.findOne({ _id: req.params.id })
        .populate('property', ['name'])
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
      return apiResponse.validationErrorWithData(res, 'Email is missing');
    }
    try {
      User.findOne({ email: req.params.email })
        .populate('property', ['name'])
        .then(user => {
          const { _id, firstName, lastName, email, phone, role, isactive } =
            user;
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
              token,
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
  body('firstName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('lastName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('email')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
  sanitizeBody('firstName').escape(),
  sanitizeBody('lastName').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('phone').escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(res, errors.array());
      } else {
        const { firstName, lastName, email, phone } = req.body;
        // Create User object with escaped and trimmed data
        var user = new User({
          firstName,
          lastName,
          email,
          phone,
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
      var user = { isactive: false };
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, 'Invalid ID');
      } else {
        User.findOne(
          { _id: req.params.id, isactive: true },
          function (err, foundUser) {
            if (foundUser === null) {
              return apiResponse.notFoundResponse(res);
            } else {
              // Disable user.
              User.findByIdAndUpdate(req.params.id, user, function (err) {
                const response = err
                  ? apiResponse.ErrorResponse(res, err)
                  : apiResponse.successResponseWithData(res, user);
                return response;
              });
            }
          },
        );
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
