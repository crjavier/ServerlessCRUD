'use strict';

// dependencies
const { expect } = require('chai');
const { resolve } = require('path');
const AWS = require('aws-sdk-mock');

// tested function
const { remove } = require('../src/handler');

// config
AWS.setSDK(resolve('src/node_modules/aws-sdk'));

// static variables
let event = null;

describe('delete tests', () => {
  beforeEach(() => {
    // create event before starting tests
    event = {
      pathParameters: {
        id: '12345',
      },
    };
  });

  it('Should return a success deleted', (done) => {
    // adding the mock for documentClient.delete
    AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
      callback(null, {
        Item: { },
      });
    });

    remove(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(202);

      done();
    });
  });

  it('Should return a \'not item found\' message', (done) => {
    // adding the mock for documentClient.delete
    AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
      callback(null, { });
    });

    remove(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(404);

      const body = JSON.parse(payload.body);

      expect(body).to.equals('Item not found');

      done();
    });
  });

  it('Should return an error', (done) => {
    // adding the mock for documentClient.delete
    AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
      callback({});
    });

    remove(event, {}, (err, payload) => {
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
