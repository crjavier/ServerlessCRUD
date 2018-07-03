'use strict';

// dependencies
const { expect } = require('chai');
const { resolve } = require('path');
const AWS = require('aws-sdk-mock');

// tested function
const { retrieve } = require('../src/handler');

// config
AWS.setSDK(resolve('src/node_modules/aws-sdk'));

// static variables
let event = null;

describe('retrieve tests', () => {
  beforeEach(() => {
    // create event before starting tests
    event = {
      pathParameters: {
        id: '12345',
      },
    };
  });

  it('Should return a todo object', (done) => {
    // adding the mock for documentClient.get
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {
        // return mocked item to function
        Item: {
          id: '12345',
          success: true,
        },
      });
    });

    retrieve(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(200);

      const body = JSON.parse(payload.body);

      expect(body.success).to.equals(true);
      expect(body.id).to.equals('12345');

      done();
    });
  });

  it('Should return a \'not item found\' message', (done) => {
    event.pathParameters = {};

    // adding the mock for documentClient.get
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {
        // return mocked item to function
        statusCode: 404,
      });
    });

    retrieve(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(404);

      const body = JSON.parse(payload.body);

      expect(body).to.equals('Item not found');

      done();
    });
  });

  it('Should return an error message', (done) => {
    event.pathParameters = {};

    // adding the mock for documentClient.get
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(new Error('mensaje de error.'));
    });

    retrieve(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(500);

      done();
    });
  });

  // restore AWS after each test
  afterEach(() => (
    AWS.restore()
  ));
});
