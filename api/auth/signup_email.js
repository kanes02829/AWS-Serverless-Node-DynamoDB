const digitGenerator = require('crypto-secure-random-digit');
const uuid = require('uuid');
const { validateEmail, sendResponse } = require('../utils/utils');
const message = require('../config/Message');
const statusCode = require('../config/statusCode');
const authMiddleware = require('../middleware/auth.middleware');

const { addElement, getById, updateCode } = require('../lib/dynamo');
const { sendEmail } = require('../lib/mailer');

module.exports.handler = async (event) => {
  try {
    await authMiddleware(event);

    const email = JSON.parse(event.body).email;
    const name = JSON.parse(event.body).name ? JSON.parse(event.body).name : '';
    // console.log(JSON.parse(event.body).email);

    if (!email || !validateEmail(email)) {
      return sendResponse(statusCode.BAD_REQUEST, {
        error: message.BAD_REQUEST,
      });
    }

    const secretLoginCode = digitGenerator.randomDigits(6).join('');
    const isRegsitered = await getById('user', 'email', email);

    //Make the content.
    const content = `<html><body><div><b>Verify your email:${email}</b></div><br><br><div>Verify Code <div>${secretLoginCode}</div></div></body></html>`;

    //Send the email.
    const sendEmailResult = await sendEmail(email, 'Email validation', content);

    if (!sendEmailResult) {
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        message: message.INTERNAL_SERVER_ERROR,
      });
    }

    // when create new document
    if (isRegsitered.Count === 0) {
      //Record the email.
      const timeStamp = new Date().getTime();
      const id = uuid.v1();
      const emailRegistration = {
        id: id,
        email: email,
        code: secretLoginCode,
        chatbot: [
          {
            chatbot_id: uuid.v1(),
            chatbot_name: name ? name : 'chatbot 1',
            chatbot_indexName: '',
            chatbot_active: true,
          },
        ],
        createdAt: timeStamp,
        updatedAt: timeStamp,
        expire: '',
        validate: false,
      };
      const dbResult = await addElement('user', emailRegistration);
      console.log('dbResult: ', dbResult);
    }

    // when you have already registered
    if (isRegsitered.Count !== 0) {
      const updatedValueResult = await updateCode(
        'user',
        isRegsitered.Items[0].id,
        email,
        'code',
        secretLoginCode
      );

      if (!updatedValueResult) {
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
          message: message.INTERNAL_SERVER_ERROR,
        });
      }
    }

    return sendResponse(200, {
      message: message.SUCCESS,
      data: { email: email },
    });
  } catch (err) {
    console.log('Error occured', err);
    return sendResponse(500, err);
  }
};
