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
  }, (err) => {
    if (err) {
      callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
    } else {
      callback(null, { statusCode: 201, body: JSON.stringify(newItem) });
    }
  });
};

module.exports.retrieve = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().get({
    TableName,
    Key: {
      id: event.pathParameters.id,
    },
  }, (err, result) => {
    if (err) {
      callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
    } else if (!result.Item) {
      callback(null, { statusCode: 404, body: JSON.stringify('Item not found') });
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify(result.Item) });
    }
  });
};

module.exports.remove = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().delete({
    TableName,
    Key: {
      id: event.pathParameters.id,
      //NumberRangeKey: 1
    },
  }, (err, result) => {
    if (err) {
      callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
    } else if (!result.Item) {
      callback(null, { statusCode: 404, body: JSON.stringify('Item not found') });
    } else {
      callback(null, { statusCode: 202, body: JSON.stringify('Accepted.') });
    }
  });
};

module.exports.retrieveAll = (event, context, callback) => {
  new aws.DynamoDB.DocumentClient().scan({
    TableName,
  }, (err, response) => {
    if (err) {
      callback(null, { statusCode: 500, body: JSON.stringify(err.code) });
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify(response.Items) });
    }
  });
};
