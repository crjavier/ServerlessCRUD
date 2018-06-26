// dependencies
const aws = require('aws-sdk');
const uuid = require('uuid-v4');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const TableName = 'todoList-items';

module.exports.retrieve = (event, context, callback) => {
    dynamoDb.get({
      TableName,
      Key: {
        id: event.pathParameters.id,
      },
    }, (err, result) => (
      err ? callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.code),
      }) : !result.Item ?
      callback(null, {
        statusCode: 404,
        body: JSON.stringify('Item not found'),
      }) : callback(null, {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      })
    ));
  }