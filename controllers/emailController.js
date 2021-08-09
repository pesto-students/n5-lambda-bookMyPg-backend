const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
const templateText = require('../helpers/templateText');
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
  body('type')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Type must be specified.'),
  sanitizeBody('email').escape(),
  sanitizeBody('type').escape(),
  (req, res) => {
    try {
      console.log(req.body);
      let emailReplacements = {};
      if (req.body.type === 'Visit') {
        emailReplacements = templateText.visitTemplate(req.body);
      } else if (req.body.type === 'Userrating') {
        emailReplacements = templateText.userratingTemplate(req.body);
      } else if (req.body.type === 'Propertyrating') {
        console.log('here');
        emailReplacements = templateText.propertyratingTemplate(req.body);
        console.log(emailReplacements);
      } else if (req.body.type === 'Query') {
        emailReplacements = templateText.queryTemplate(req.body);
      }
      mailer.send(req.body.from, req.body.to, emailReplacements);
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
