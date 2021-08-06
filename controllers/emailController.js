const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const mailer = require('../helpers/mailer');

/**
 * Amenity store.
 *
 * @param {string}      email
 * @param {string}      type
 *
 * @returns {Object}
 */
exports.emailSend = [
  // Validate fields.
  body('email')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Email must be specified.'),
  sanitizeBody('email').escape(),
  //sanitizeBody('logo').escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Html email body
      let html = '<p>Please Confirm your Account.</p><p>OTP';
      console.log(html);
      // Send confirmation email
      mailer.send(
        'monalidoshi9@gmail.com',
        'monalidoshi9@gmail.com',
        'Confirm Account',
        html,
      );

      return apiResponse.successResponseWithData(
        res,
        'Email Send Success.',
        req.body,
      );
    } catch (err) {
      // Throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
