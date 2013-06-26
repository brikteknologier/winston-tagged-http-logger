var http = require('http');
var wthl = require('../');
var winston = require('winston');
var TaggedLogger = require('tagged-logger');
var assert = require('assert');
var express = require('express');
var request = require('supertest');

describe('Tagged http logger', function() {
  var logger;
  var transport;
  beforeEach(function() {
    transport = new winston.transports.Memory();
    var baseLogger = new winston.Logger({transports: [transport]});
    logger = new TaggedLogger(baseLogger, []);
  });
  
  describe('Vanilla HTTP server', function() {
    var server;
    beforeEach(function() {
      server = http.createServer(function(req, res) {
        if (req.url == '/sync') {
          res.end();
        } else if (req.url == '/async') {
          setTimeout(function() { res.statusCode = 201; res.end() }, 10);
        }
      });
      wthl(server, logger);
    });

    it('should log the http listen event', function(done) {
      server.listen(0, function() {
        process.nextTick(function() {
          assert(transport.writeOutput.length == 1);
          assert(transport.writeOutput[0].match(/listening/gi));
          done();
        });
      });
    });

    it('should log a request', function(done) {
      server.listen(0, function() {
        request(server).get('/sync').end(function(err, res) {
          assert(transport.writeOutput.length == 2);
          assert(transport.writeOutput[1].match(/get/gi));
          assert(transport.writeOutput[1].match(/sync/gi));
          assert(transport.writeOutput[1].match(/200/g));
          done();
        });
      });
    });

    it('should log an async request', function(done) {
      server.listen(0, function() {
        request(server).get('/async').end(function(err, res) {
          assert(transport.writeOutput.length == 2);
          assert(transport.writeOutput[1].match(/get/gi));
          assert(transport.writeOutput[1].match(/async/gi));
          assert(transport.writeOutput[1].match(/201/g));
          done();
        });
      });
    });
  });

  describe('express http server', function() {
    var server;
    beforeEach(function() {
      server = express();
      wthl(server, logger);
      server.get('/sync', function(req, res) { res.end() });
      server.get('/async', function(req, res) {
        setTimeout(function() { res.statusCode = 201; res.end() }, 10);
      });
    });
    it('should log the http listen event', function(done) {
      server.listen(0, function() {
        process.nextTick(function() {
          assert(transport.writeOutput.length == 1);
          assert(transport.writeOutput[0].match(/listening/gi));
          done();
        });
      });
    });

    it('should log a request', function(done) {
      server.listen(0, function() {
        request(server).get('/sync').end(function(err, res) {
          assert(transport.writeOutput.length == 2);
          assert(transport.writeOutput[1].match(/get/gi));
          assert(transport.writeOutput[1].match(/sync/gi));
          assert(transport.writeOutput[1].match(/200/g));
          done();
        });
      });
    });

    it('should log an async request', function(done) {
      server.listen(0, function() {
        request(server).get('/async').end(function(err, res) {
          assert(transport.writeOutput.length == 2);
          assert(transport.writeOutput[1].match(/get/gi));
          assert(transport.writeOutput[1].match(/async/gi));
          assert(transport.writeOutput[1].match(/201/g));
          done();
        });
      });
    });

    it('should handle nested express servers', function(done) {
      var nestedServer = express();
      nestedServer.get('/thing', function(req, res) { res.end() });
      server.use('/nested', nestedServer);

      server.listen(0, function() {
        request(server).get('/nested/thing').end(function(err, res) {
          assert(transport.writeOutput.length == 2);
          assert(transport.writeOutput[1].match(/get/gi));
          assert(transport.writeOutput[1].match(/\/nested\/thing/gi));
          assert(transport.writeOutput[1].match(/200/g));
          done();
        });
      });
    });
  });
});

