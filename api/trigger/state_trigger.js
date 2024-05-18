const AWS = require("aws-sdk");
const uuid = require("uuid");
const utils = require("../utils/utils");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);

    if (!data) {
      return utils.sendResponse(400, { error: "Bad Request" });
    }

    const params = {
      TableName: "Site_List",
      Key: {
        id: data.id,
      },
    };

    const result = await dynamoDb.get(params).promise();

    if (result.Item.update_state) {
      const siteParams = {
        TableName: "Site_List",
        Key: {
          id: data.id,
        },
        ExpressionAttributeNames: {
          "#update_state": "update_state",
        },
        ExpressionAttributeValues: {
          ":update_state": false,
          ":updatedAt": timeStamp,
        },
        UpdateExpression:
          "SET #update_state = :update_state, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW",
      };

      await dynamoDb.update(siteParams).promise();
    }

    const response = {
      statusCode: 200,
      body: result,
    };

    return utils.sendResponse(200, response);
  } catch (err) {
    console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
