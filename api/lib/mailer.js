const AWS = require('aws-sdk');

/**
 * Send email.
 * @param {string} email string.
 * @returns {Promise}.
 */
const sendEmail = (destination, subject, content) => {
  const params = {
    Source: 'charlesmarch22@gmail.com',
    Destination: {
      ToAddresses: [destination],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: content,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  return new AWS.SES().sendEmail(params).promise();
};

module.exports = {
  sendEmail,
};
