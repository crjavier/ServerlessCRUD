'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid-v4');

const TableName = 'todoList-items';

module.exports.create = (event, context, callback) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const newItem = {
    id: uuid(),
    info: {
      createdAt: Date.now(),
      description: body.description,
      title: body.title,
    },
  };

  new aws.DynamoDB.DocumentClient().put({
    TableName,
    Item: newItem,
  }).promise()

  .then(() => {
    callback(null, { statusCode: 201, body: JSON.stringify(newItem) });
  })

  .catch((err) => {
    callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
  });
};

module.exports.retrieve = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().get({
    TableName,
    Key: {
      id: event.pathParameters.id,
    },
  }).promise()

  .then((result) => {
    if (!result.Item) {
      callback(null, { statusCode: 404, body: JSON.stringify('Item not found') });
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify(result.Item) });
    }
  })

  .catch((err) => {
    callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
  });
};

module.exports.remove = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().delete({
    TableName,
    Key: {
      id: event.pathParameters.id,
      //NumberRangeKey: 1
    },
  }).promise()

  .then((result) => {
    if (!result.Item) {
      callback(null, { statusCode: 404, body: JSON.stringify('Item not found') });
    } else {
      callback(null, { statusCode: 202, body: JSON.stringify('Accepted.') });
    }
  })

  .catch((err) => {
    callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
  });
};

module.exports.retrieveAll = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().scan({
    TableName,
  }).promise()

  .then((result) => {
    callback(null, { statusCode: 200, body: JSON.stringify(result.Items) });
  })

  .catch((err) => {
    callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
  });
};
