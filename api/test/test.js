const utils = require('../utils/utils');

module.exports.handler = async (event) => {
  try {
    return utils.sendResponse(200, { message: 'success test' });
  } catch (err) {
    // console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
