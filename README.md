Installation
============

    npm install winston-tagged-http-logger

Usage
=====

For this example to work, you need to `npm install winston tagged-logger winston-tagged-http-logger`.

    var server = require('http').createServer();
    var log = new (require('tagged-logger'))(require('winston'), []);
    require('winston-tagged-http-logger')(server, log);

    // From now on, important events from `server` will be logged to `log`
