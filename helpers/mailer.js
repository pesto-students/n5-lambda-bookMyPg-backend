var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

var source = fs
  .readFileSync('../email-template/template.html', 'utf-8')
  .toString();
var template = handlebars.compile(source);

exports.send = function (from, to, subject, notification_text) {
  const replacements = {
    notification_text: notification_text,
  };

  const htmlToSend = template(replacements);
  return transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: htmlToSend,
  });
};
