const AWS = require('aws-sdk');
const { sendResponse } = require('../utils/utils');

var ddb = new AWS.DynamoDB();

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    if (!data) {
      return utils.sendResponse(400, { message: 'Bad Request' });
    }

    const params = {
      TableName: data.tableName,
    };

    await ddb.deleteTable(params).promise();

    return sendResponse(200, { message: 'Delete table successful' });
  } catch (err) {
    return sendResponse(500, { message: "Couldn't remove this Table" });
  }
};
