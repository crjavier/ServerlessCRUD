'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid-v4');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const TableName = 'todoList-items';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      context: context
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.create = (event, context, callback) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const newItem = {
    id: uuid(),
    info: {
      createdAt: Date.now(),
      description: body.description,
      title: body.title,
    }
  };

  dynamoDb.put({
    TableName,
    Item: newItem,
  }, (err) => (
    err ? callback(null, {
      statusCode: 500,
      body: JSON.stringify(err.code),
    }) : callback(null, {
      statusCode: 201,
      body: JSON.stringify(newItem),
    })
  ));
};

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
};

module.exports.delete = (event, context, callback) => {
  dynamoDb.delete({
    TableName,
    Key: {
      id: event.pathParameters.id
      //NumberRangeKey: 1
    }
  }, (err, response) => {
      if(err) {
        callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.code)
        });
      } else {
        callback(null, {
        statusCode: 202,
        body: JSON.stringify('Accepted.')
        });
      }
  });
};

module.exports.retrieveAll = (event,context, callback) => {
  dynamoDb.scan({
    TableName
  }, (err, response) => {
    if(err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.code)
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(iterateData(response.Items))
      });
    }
  });
}

function iterateData(items) {
  var array = [];
  items.forEach(element => {
    array.push({
      "id": element.id,
      "info": {
        "title": element.info.title,
        "createdAt": element.info.createdAt,
        "description": element.info.description
      }});
  });

  return array;
}
