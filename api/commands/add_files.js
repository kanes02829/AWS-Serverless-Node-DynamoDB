const authMiddleware = require('../middleware/auth.middleware');
const { sendResponse } = require('../utils/utils');
// const message = require('../config/Message');
// const statusCode = require('../config/statusCode');

const upload = multer({ dest: 'uploads/' });

module.exports.handler = async (event) => {
  const httpRequest = event.Records[0].cf.request; // Retrieve the CloudFront request

  const filesMiddleware = upload.array('files'); // Assign the middleware function

  return new Promise((resolve, reject) => {
    filesMiddleware(httpRequest, {}, (err) => {
      if (err) {
        reject({
          statusCode: 400,
          body: JSON.stringify({ message: 'File upload failed' }),
        });
      } else {
        // Get the array of uploaded files from `req.files`
        const uploadedFiles = httpRequest.files;

        // Process the uploaded files as needed
        // ...

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: 'Files uploaded successfully',
            files: uploadedFiles,
          }),
        });
      }
    });
  });
};
