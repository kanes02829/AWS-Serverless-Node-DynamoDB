const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/utils');
const message = require('../config/Message');
const statusCode = require('../config/statusCode');

// const authMiddleware = async (event) => {
//   const token = event.headers['x-access-token'];

//   if (!token) {
//     // throw new Error('Token not provided');
//     return sendResponse(statusCode.UNAUTHORIZED, {
//       message: message.UNAUTHORIZED,
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     const { exp } = decoded;
//     if (Date.now() >= exp * 1000) {
//       // throw new Error('Token is expired');
//       return sendResponse(statusCode.UNAUTHORIZED, {
//         message: message.UNAUTHORIZED,
//       });
//     }

//     return event; // Pass the event object to the next handler
//   } catch (error) {
//     // Throw an error to trigger the catch block in the Lambda function
//     // throw new Error('Token Authentication Failed');
//     return sendResponse(statusCode.UNAUTHORIZED, {
//       message: message.UNAUTHORIZED,
//     });
//   }
// };

const authMiddleware = async (event) => {
  try {
    console.log('AuthMiddleware!!!');

    return event; // Pass the event object to the next handler
  } catch (error) {
    // Throw an error to trigger the catch block in the Lambda function
    // throw new Error('Token Authentication Failed');
    return sendResponse(statusCode.UNAUTHORIZED, {
      message: message.UNAUTHORIZED,
    });
  }
};

module.exports = authMiddleware;
