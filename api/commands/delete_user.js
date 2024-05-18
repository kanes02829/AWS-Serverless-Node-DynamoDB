// delete account
const authMiddleware = require('../middleware/auth.middleware');
const { sendResponse, validateEmail } = require('../utils/utils');
const message = require('../config/Message');
const statusCode = require('../config/statusCode');
const { getById, deleteOneUser } = require('../lib/dynamo');

module.exports.handler = async (event) => {
  try {
    await authMiddleware(event);
    const email = JSON.parse(event.body).email;
    if (!email || !validateEmail(email))
      return sendResponse(statusCode.BAD_REQUEST, {
        error: message.BAD_REQUEST,
      });
    const userInfo = await getById('user', 'email', email);
    console.log('userInfo success: ', userInfo);

    if (!userInfo) {
      console.log('userInfo error: ', userInfo);
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        message: message.INTERNAL_SERVER_ERROR,
      });
    }
    const result = await deleteOneUser('user', userInfo.Items[0].id, email);

    if (!result) {
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        message: message.INTERNAL_SERVER_ERROR,
      });
      // how to check if it is not existed or failed due to server error
    }
    console.log('result success: ', result);

    return sendResponse(200, {
      message: message.SUCCESS,
      data: { email: email },
    });
  } catch (err) {
    console.error('Error checking link type:', err);
    return sendResponse(500, err);
  }
};
