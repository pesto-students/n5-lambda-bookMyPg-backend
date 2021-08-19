const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
const templateText = require('../helpers/templateText');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const mailer = require('../helpers/mailer');
const constants = require('../constants');

/**
 * Email send.
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
      let emailReplacements = {};
      emailReplacements = templateText[
        constants.EMAIL_TEMPLATE_TEXT[req.body.type]
      ](req.body);

      mailer.send(req.body.useremail, req.body.owneremail, emailReplacements);
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
