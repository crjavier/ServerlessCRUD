'use strict';

// dependencies
const { expect } = require('chai');
const { resolve } = require('path');
const AWS = require('aws-sdk-mock');

// tested function
const { retrieveAll } = require('../src/handler');

// config
AWS.setSDK(resolve('src/node_modules/aws-sdk'));

// static variables
let event = null;

describe('retrieve all tests', () => {
  beforeEach(() => {
    // create event before starting tests
    event = {
      pathParameters: { },
    };
  });

  it('Should return a todo objects', (done) => {
    // adding the mock for documentClient.scan
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      callback(null, {
        // return mocked item to function
        Items: [{
          id: '12345',
          info: {
            title: 'todo title',
            description: 'todo description',
            createdAt: 101010,
          },
        }, {
          id: '54321',
          info: {
            title: 'todo title',
            description: 'todo description',
            createdAt: 101010,
          },
        }],
        statusCode: 200,
      });
    });

    retrieveAll(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(200);

      const body = JSON.parse(payload.body);

      expect(body).to.be.an('array');

      done();
    });
  });

  it('Should return an error', (done) => {
    // adding the mock for documentClient.scan
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      callback({});
    });

    retrieveAll(event, {}, (err, payload) => {
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
