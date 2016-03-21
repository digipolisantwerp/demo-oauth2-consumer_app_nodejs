'use strict';

// Dependencies
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

// var async = require('async');
// var nock = require('nock');

// Start the application
require('../../app.js');

// Silence jshint warning
should.equal(true, true);

// Config
var api = supertest('http://localhost:' + "3001");

// Endpoint to test
var endpoint = '/api/v1/examples';

describe('multiple test in API projects', function () {


  it('no tests in this project :(', function (done) {

    'no tests in this project :('.should.contain('test');
    done();

  });

});
