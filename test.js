'use strict';

var assert = require('assert');
var Joi = require('joi');
var joiObjectId = require('./');

describe('joi-objectid', function() {
  it('exports a function', function(done) {
    assert.strictEqual('function', typeof joiObjectId);
    done();
  });

  it('expects to receive a Joi module', function(done) {
    assert.throws(joiObjectId, /must pass Joi/);
    done();
  });

  it('returns a validator function', function(done) {
    var fn = joiObjectId(Joi);
    assert.strictEqual('function', typeof fn);
    done();
  });

  it('requires an hexadecimal string of 24 chars', function(done) {
    var oid = joiObjectId(Joi);

    var tests = [
      { val: '$bcd56789012345678901234', pass: false }
    , { val: ' bcd56789012345678901234', pass: false }
    , { val: 'abcd5678901234567890123', pass: false }
    , { val: 'abcd56789012345678901234', pass: true }
    , { val: 123456789012345678901234, pass: false }
    , { val: { length: 24 } , pass: false }
    ]

    var schema = oid();

    tests.forEach(function(test) {
      var res = schema.validate(test.val);
      assert(test.pass === ! res.error, res.error);
    });

    done();
  });

  it('expects to receive a default message passing invalid value', function(done) {
    var dbId = joiObjectId(Joi);
    var schema = dbId();
    var result = schema.validate('blah');

    assert(result.error);
    assert(result.error.message.indexOf('valid mongo id') >= 0);
    done();
  });

  it('expects to receive a default message passing array in message parameter', function(done) {
    var dbId = joiObjectId(Joi, []);
    var schema = dbId();
    var result = schema.validate('blah');

    assert(result.error);
    assert(result.error.message.indexOf('valid mongo id') >= 0);
    done();
  });

  it('expects to receive a default message passing object in message parameter', function(done) {
    var dbId = joiObjectId(Joi, {});
    var schema = dbId();
    var result = schema.validate('blah');

    assert(result.error);
    assert(result.error.message.indexOf('valid mongo id') >= 0);
    done();
  });

  it('expects to receive a default message passing number in message parameter', function(done) {
    var dbId = joiObjectId(Joi, 123456);
    var schema = dbId();
    var result = schema.validate('blah');

    assert(result.error);
    assert(result.error.message.indexOf('valid mongo id') >= 0);
    done();
  });

  it('includes custom message for invalid value', function(done) {
    var dbId = joiObjectId(Joi, 'database id');
    var schema = dbId();
    var result = schema.validate('blah');

    assert(result.error);
    assert(result.error.message.indexOf('database id') >= 0);
    done();
  });
});
