const AWS = require('aws-sdk');

const { sendResponse } = require('../utils/utils');

var ddb = new AWS.DynamoDB();

module.exports.handler = async (event) => {
  try {
    console.log(event);
    const data = JSON.parse(event.body);

    const params = {
      TableName: data.tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'email', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }, //replace 'N' with 'S' if the key is a string
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };

    await ddb.createTable(params).promise();

    return sendResponse(200, { message: 'Create table successful' });
  } catch (error) {
    console.log(error);
    return sendResponse(500, { message: "Couldn't create this Table" });
  }
};
