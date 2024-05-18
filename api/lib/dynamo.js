const AWS = require('aws-sdk');

//Get aws dynamo client instance.
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Add elements in a table.
 * @param {string} TableName Dynamo table name.
 * @param {object} element object to be stored in the table.
 * @returns {Promise}.
 */
const addElement = (TableName, element) => {
  //Create params.
  const params = {
    TableName,
    Item: element,
  };

  return docClient.put(params).promise();
};

/**
 * Get an element from a table by his Id.
 * @param {string} TableName Dynamo table name.
 * @param {string} key key field.
 * @param {string} id object id
 * @returns {Promise}.
 */
const getById = (TableName, key, value) => {
  console.log(value);
  //Make query params.
  const params = {
    TableName,
    FilterExpression: `${key} = :i`,
    ExpressionAttributeValues: {
      ':i': value,
    },
    ConsistentRead: true,
  };

  //Run query as promise.
  return docClient.scan(params).promise();
};

const isVerifiedUser = (TableName, key1, value1, key2, value2) => {
  const params = {
    TableName,
    FilterExpression: `(${key1} = :i1) AND (${key2} = :i2)`,
    ExpressionAttributeValues: {
      ':i1': value1,
      ':i2': value2,
    },
    ConsistentRead: true,
  };

  //Run query as promise.
  return docClient.scan(params).promise();
};

const updateValidate = (TableName, filter_value, update_key, update_value) => {
  console.log('validate: ', update_value);
  const params = {
    TableName,
    Key: {
      id: filter_value,
      email: 'charmingcat829@gmail.com',
    },
    UpdateExpression: `SET ${update_key} = :i`,
    ExpressionAttributeValues: {
      ':i': update_value,
    },
    ReturnValues: 'ALL_NEW',
  };
  return docClient.update(params).promise();
};

const updateCode = (
  TableName,
  id_value,
  email_value,
  update_key,
  update_value
) => {
  console.log(TableName);
  console.log('validate: ', update_value);
  console.log('code', update_key);

  const params = {
    TableName,
    Key: {
      id: id_value,
      email: email_value,
    },
    UpdateExpression: `SET ${update_key} = :i`,
    ExpressionAttributeValues: {
      ':i': update_value,
    },
    ReturnValues: 'ALL_NEW',
  };
  return docClient.update(params).promise();
};

const deleteOneUser = (TableName, id, email) => {
  const params = {
    TableName,
    Key: {
      id: id,
      email: email,
    },
    ReturnValues: 'ALL_OLD',
  };
  return docClient.delete(params).promise();
};

const getChatbot = (TableName, email, chatbot_id) => {
  const params = {
    TableName,
    FilterExpression: '(email = :i1) AND (chatbot.chatbot_id = :i2)',
    ExpressionAttributeValues: {
      ':i1': email,
      ':i2': chatbot_id,
    },
    ConsistentRead: true,
  };

  //Run query as promise.
  return docClient.scan(params).promise();
};

const updateChatbotName = (
  TableName,
  email,
  chatbot_id,
  new_chatbot_name
) => {};

module.exports = {
  addElement,
  getById,
  isVerifiedUser,
  updateValidate,
  updateCode,
  deleteOneUser,
  getChatbot,
  updateChatbotName,
};
