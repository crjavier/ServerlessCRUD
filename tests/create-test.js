'use strict';

// dependencies
const { expect } = require('chai');
const { resolve } = require('path');
const AWS = require('aws-sdk-mock');

// tested function
const { create } = require('../src/handler');

// config
AWS.setSDK(resolve('src/node_modules/aws-sdk'));

// static variables
let event = null;

describe('create tests', () => {
  beforeEach(() => {
    // create event before starting tests
    event = {
      body: {
        title: 'todo title',
        description: 'todo description',
      },
    };
  });

  it('Should return a todo object sending Json format', (done) => {
    // adding the mock for documentClient.put
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {
        // return mocked item to function
        Item: {
          statusCode: 201,
          success: true,
        },
      });
    });

    create(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(201);

      const body = JSON.parse(payload.body);

      expect(body.info.title).to.equal(event.body.title);

      done();
    });
  });

  it('Should return a todo object sendind string format', (done) => {
    event = {
      body: JSON.stringify({
        title: 'todo title',
        description: 'todo description',
      }),
    };

    // adding the mock for documentClient.put
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {
        // return mocked item to function
        Item: {
          statusCode: 201,
          success: true,
        },
      });
    });

    create(event, {}, (err, payload) => {
      // validate response from service
      expect(err).to.equals(null);
      expect(payload.statusCode).to.equals(201);

      const body = JSON.parse(payload.body);

      expect(body.info.title).to.equal(JSON.parse(event.body).title);

      done();
    });
  });

  it('Should return an error', (done) => {
    event = {
      body: JSON.stringify({
        title: 'todo title',
        description: 'todo description',
      }),
    };

    // adding the mock for documentClient.put
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback({});
    });

    create(event, {}, (err, payload) => {
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
