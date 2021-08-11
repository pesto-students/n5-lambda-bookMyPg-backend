const Property = require('../models/propertyModel');
const Location = require('../models/locationModel');
const Review = require('../models/reviewModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
const constants = require('../constants');
const ObjectId = mongoose.Types.ObjectId;

async function filterQuery(data) {
  try {
    var filterString = {};
    let res = '';

    // Filter based on Gender
    if (data.gender) {
      filterString['gender'] = { $in: data.gender.split(',') };
    }

    // Filter based on Rent
    if (data.rent) {
      let rentList = data.rent.split(',').map(Number);
      let rentFilterList = [];
      let rentFilterString = {};
      rentList.map(rent => {
        rentFilterString['rent'] = {
          $lte: constants.RENT_FILTER_CONVENTIONS[rent]['less_than'],
          $gte: constants.RENT_FILTER_CONVENTIONS[rent]['greater_than'],
        };
        rentFilterList.push(rentFilterString);
        rentFilterString = {};
      });
      filterString['$or'] = rentFilterList;
    }

    // Search based on Location
    if (data.search) {
      res = await Location.findOne({ name: data.search });

      if (res) {
        filterString['location'] = res._id;
      }
    }

    // Filter based on Ratings
    if (data.ratings) {
      res = await Review.distinct('property', {
        rating: { $in: data.ratings.split(',').map(Number) },
      });
      if (res) {
        filterString['_id'] = { $in: res };
      }
    }
    return filterString;
  } catch (err) {
    throw new Error('Error in query');
  }
}

async function getReviewAnalysis(property_id) {
  if (property_id) {
    // Get reviews
    reviews = await Review.find({
      property: property_id,
    });

    // Find review analysis
    if (reviews) {
      totalDocument = reviews.length;
      review_percentage = await Review.aggregate([
        { $match: { property: ObjectId(property_id) } },
        {
          $group: {
            _id: '$rating',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            count: 1,
            percentage: {
              $trunc: [
                { $multiply: [{ $divide: [100, totalDocument] }, '$count'] },
                2,
              ],
            },
          },
        },
      ]);
    }
    if (review_percentage) {
      review_res = { reviews: reviews, reviewanalysis: review_percentage };
      return review_res;
    }
  }
}

/**
 * Property List.
 *
 * @returns {Object}
 */
exports.propertyList = [
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
            query = Property.find(filterString)
              .populate('location', constants.POPULATE_LOCATION_FIELDS)
              .populate('amenities', constants.POPULATE_AMENITY_FIELDS)
              .populate('owner', constants.POPULATE_USER_FIELDS)
              .populate('numreviews')
              .sort(sortFilter)
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          } else {
            query = Property.find(filterString)
              .populate('location', constants.POPULATE_LOCATION_FIELDS)
              .populate('amenities', constants.POPULATE_AMENITY_FIELDS)
              .populate('owner', constants.POPULATE_USER_FIELDS)
              .populate('numreviews')
              .skip(
                (filterData.pagenumber - 1) * parseInt(filterData.countperpage),
              )
              .limit(parseInt(filterData.countperpage));
          }
        } else if (filterData.columnname && filterData.orderby) {
          sortFilter[filterData.columnname] = filterData.orderby;
          query = Property.find(filterString)
            .populate('location', constants.POPULATE_LOCATION_FIELDS)
            .populate('amenities', constants.POPULATE_AMENITY_FIELDS)
            .populate('owner', constants.POPULATE_USER_FIELDS)
            .populate('numreviews')
            .sort(sortFilter);
        } else {
          query = Property.find(filterString)
            .populate('location', constants.POPULATE_LOCATION_FIELDS)
            .populate('amenities', constants.POPULATE_AMENITY_FIELDS)
            .populate('owner', constants.POPULATE_USER_FIELDS)
            .populate('numreviews');
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
 * Property Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.propertyDetail = [
  async function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid ID');
    }
    try {
      await getReviewAnalysis(req.params.id).then(result => {
        Property.findOne({ _id: req.params.id })
          .populate('location', constants.POPULATE_LOCATION_FIELDS)
          .populate('amenities', constants.POPULATE_AMENITY_FIELDS)
          .populate('owner', constants.POPULATE_USER_FIELDS)
          .populate('numreviews')
          .then(property => {
            if (property !== null) {
              var final_response = {};
              final_response['propertydata'] = property;
              final_response['reviewdata'] = result;
              return apiResponse.successResponseWithData(res, final_response);
            } else {
              apiResponse.successResponseWithData(res, []);
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
 * Property store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.propertyStore = [
  // Validate fields.
  body('description')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Description must be specified.'),
  body('address')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Address must be specified.'),
  body('name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Name must be specified.'),
  sanitizeBody('name').escape(),
  sanitizeBody('description').escape(),
  sanitizeBody('address').escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(res, errors.array());
      } else {
        const {
          name,
          location,
          address,
          description,
          rent,
          totalbeds,
          amenities,
          owner,
          photos,
        } = req.body;
        // Create Property object with escaped and trimmed data
        var property = new Property({
          name,
          location,
          address,
          description,
          rent,
          totalbeds,
          amenities,
          owner,
          photos,
        });

        // Save property.
        property.save(function (err) {
          const response = err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponseWithData(res, property);
          return response;
        });
      }
    } catch (err) {
      // Throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
