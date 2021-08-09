var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
var path = require('path');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});
const filePath = path.join(__dirname, '../email-template/template.html');
const source = fs.readFileSync(filePath, 'utf-8').toString();
const template = handlebars.compile(source);

exports.send = function (from, to, subject, notification_text) {
  console.log(notification_text);
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
