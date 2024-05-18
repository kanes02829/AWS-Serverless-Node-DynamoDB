const {
  validateEmail,
  sendResponse,
  generateToken,
} = require('../utils/utils');
const message = require('../config/Message');
const statusCode = require('../config/statusCode');
const authMiddleware = require('../middleware/auth.middleware');
const { isVerifiedUser, updateValidate, getById } = require('../lib/dynamo');

const verifyCode = async (email, code) => {
  //Find in dynamo db using the client Id.
  const result = await isVerifiedUser('user', 'email', email, 'code', code);
  console.log('result: ', result);
  //Parse the result.
  if (!(result && result.Items && result.Items.length > 0)) {
    return false;
  }
  //Get the element.
  const element = result.Items[0];
  console.log('element: ', element);

  const updatedResult = await updateValidate(
    'user',
    element.id,
    'validate',
    true
  );

  // console.log('updatedResult: ', updatedResult);
  if (!updatedResult.Attributes.validate) {
    return false;
  }

  return true;
};

module.exports.handler = async (event) => {
  try {
    await authMiddleware(event);
    const timeStamp = new Date().getTime();
    const email = JSON.parse(event.body).email;
    const code = JSON.parse(event.body).code;
    console.log(email);
    console.log(code);
    if (
      !email ||
      !validateEmail(email) ||
      !code ||
      !(await verifyCode(email, code))
    ) {
      console.log('xxxxxxxxx');
      return sendResponse(statusCode.BAD_REQUEST, {
        error: message.BAD_REQUEST,
      });
    }

    // return sendResponse(200, {
    //   message: message.SUCCESS,
    //   data: { email: email },
    // });

    const currentUser = await getById('user', 'email', email);
    if (!(currentUser && currentUser.Items && currentUser.Items.length > 0))
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        message: message.INTERNAL_SERVER_ERROR,
      });

    const userInfo = {
      id: currentUser.Items[0].id,
      email: currentUser.Items[0].email,
    };

    const token = generateToken(userInfo);

    if (!token) {
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR, {
        message: message.INTERNAL_SERVER_ERROR,
      });
    }

    return sendResponse(200, {
      message: message.SUCCESS,
      data: { email: email, token: token },
    });
  } catch (err) {
    console.log('Error occured', err);
    return sendResponse(500, err);
  }
};
