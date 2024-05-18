// update chatbot name
const authMiddleware = require('../middleware/auth.middleware');
const { sendResponse, validateEmail } = require('../utils/utils');
const message = require('../config/Message');
const statusCode = require('../config/statusCode');
const { getChatbot, updateChatbotName } = require('../lib/dynamo');

module.exports.handler = async (event) => {
  try {
    await authMiddleware(event);

    const email = JSON.parse(event.body).email;
    const chatbot_id = JSON.parse(event.body).chatbot_id;
    const new_chatbot_name = JSON.parse(event.body).new_chatbot_name;

    if (!email || !validateEmail(email) || !chatbot_id || !new_chatbot_name)
      return sendResponse(statusCode.BAD_REQUEST, {
        error: message.BAD_REQUEST,
      });

    const isChatbotExisted = await getChatbot('user', email, chatbot_id);
    console.log('isChatbotExisted ', isChatbotExisted);
    if (isChatbotExisted) {
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        error: message.INTERNAL_SERVER_ERROR,
      });

      // how to check if it is not existed or failed due to server error
    }

    // const updatedUser = await updateChatbotName(
    //   'user',
    //   email,
    //   chatbot_id,
    //   new_chatbot_name
    // );

    // if (!updatedUser) {
    //   return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
    //     error: message.INTERNAL_SERVER_ERROR,
    //   });

    //   // how to check if it is not existed or failed due to server error
    // }

    return sendResponse(200, {
      message: message.SUCCESS,
      data: { email: email },
    });
  } catch (err) {
    console.log('Error occured', err);
    return sendResponse(500, err);
  }
};
