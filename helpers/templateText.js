exports.visitTemplate = function (data) {
  let text = '';
  var emailReplacements = {
    subject: 'Greetings! New Visit Scheduled',
    notification_text: text.concat(
      'New visit is scheduled for <i>',
      data.property,
      '</i> on <i>',
      data.date,
      '</i>. Kindly note, the property can be visited at any time between <i>',
      data.fromtime,
      ' to ',
      data.totime,
      '</i>',
    ),
  };
  return emailReplacements;
};

exports.userratingTemplate = function (data) {
  let text = '';
  var emailReplacements = {
    subject: 'Greetings! Your Profile is Rated',
    notification_text: text.concat(
      data.owner,
      ' - Owner of <i>',
      data.property,
      '</i> has rated your profile with <i>',
      data.rating,
      ' stars </i> on <i> ',
      data.date,
      '</i>',
    ),
  };
  return emailReplacements;
};

exports.propertyratingTemplate = function (data) {
  let text = '';
  var emailReplacements = {
    subject: 'Greetings! Your Property is Rated',
    notification_text: text.concat(
      'Tenant <i>',
      data.user,
      '</i> of <i>',
      data.property,
      '</i> has rated your property with <i>',
      data.rating,
      ' stars ',
      data.description ? ' and ' + data.description + ' ' : '',
      '</i> on <i>',
      data.date,
      '</i>',
    ),
  };
  return emailReplacements;
};

exports.queryTemplate = function (data) {
  let text = '';
  var emailReplacements = {
    subject: 'Greetings! New Query Received',
    notification_text: text.concat(
      'New Query is received: ',
      data.description,
      ' from <i>',
      data.name,
      '</i>, email: <i>',
      data.email,
      '</i> and contact no: ',
      data.contactno,
      ' on <i>',
      data.date,
      '</i>',
    ),
  };
  return emailReplacements;
};
