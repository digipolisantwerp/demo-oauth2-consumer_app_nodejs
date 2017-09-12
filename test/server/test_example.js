'use strict';

process.env.NODE_ENV = 'test';

// Dependencies
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var yamlConfig = require('node-yaml-config');

// var async = require('async');
// var nock = require('nock');

// Start the application
require('../../app.js');

// Silence jshint warning
should.equal(true, true);

// var config = yamlConfig.load(global.__base + '/config/app.yml',process.env.NODE_ENV);
var config = require(global.__base + '/config/app.conf.js');

// Config
var api = supertest('http://localhost:' + config.port);

// Endpoint to test
var endpoint = '/api/v1/examples';

describe('multiple test in API projects', function () {


  it('no tests in this project :(', function (done) {

    'no tests in this project :('.should.contain('test');
    done();

  });

});
