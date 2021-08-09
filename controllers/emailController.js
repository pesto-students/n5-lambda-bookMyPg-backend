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
  body('type')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Type must be specified.'),
  sanitizeBody('email').escape(),
  sanitizeBody('type').escape(),
  (req, res) => {
    try {
      let subject = '';
      let notification_text = '';
      if (req.body.type === 'Visit') {
        subject = '[BookMyPG] New Visit Scheduled';
        notification_text = notification_text.concat(
          'New visit is scheduled for <i>',
          req.body.property,
          '</i> on <i>',
          req.body.date,
          '</i>. Kindly note, the property can be visited at any time between <i>',
          req.body.fromtime,
          ' to ',
          req.body.totime,
          '</i>',
        );
      }
      if (req.body.type === 'Userrating') {
        subject = '[BookMyPG] Your Profile is Rated';
        notification_text = notification_text.concat(
          req.body.owner,
          ' - Owner of <i>',
          req.body.property,
          '</i> has rated your profile with <i>',
          req.body.rating,
          ' stars </i> on <i> ',
          req.body.date,
          '</i>',
        );
      }
      if (req.body.type === 'Propertyrating') {
        subject = '[BookMyPG] Your Property is Rated';
        notification_text = notification_text.concat(
          'Tenant <i>',
          req.body.user,
          '</i> of <i>',
          req.body.property,
          '</i> has rated your property with <i>',
          req.body.rating,
          ' stars ',
          req.body.description ? ' and ' + req.body.description + ' ' : '',
          '</i> on <i>',
          req.body.date,
          '</i>',
        );
      }
      if (req.body.type === 'Query') {
        subject = '[BookMyPG] New Query Received';
        notification_text = notification_text.concat(
          'New Query is received: ',
          req.body.description,
          ' from <i>',
          req.body.name,
          '</i>, email: <i>',
          req.body.email,
          '</i> and contact no: ',
          req.body.contactno,
          ' on <i>',
          req.body.date,
          '</i>',
        );
      }
      mailer.send(req.body.from, req.body.to, subject, notification_text);
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
