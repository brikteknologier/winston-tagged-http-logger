# winston-tagged-http-logger

Pipes events from a node HTTP server (vanilla OR express!) to a
[tagged-logger](http://bitbucket.org/maghoff/tagged-logger)
for [winston](https://github.com/flatiron/winston). 

## Install me!

```
npm install winston-tagged-http-logger
```

## Example

This will create a new [winston](https://github.com/flatiron/winston) 
[logger](https://github.com/flatiron/winston#instantiating-your-own-logger) and 
a new [tagged-logger](https://bitbucket.org/maghoff/tagged-logger/), and use
a [tagged-console-target](https://bitbucket.org/maghoff/tagged-console-target) 
to write the output to the console in all the colours of the rainbow.

```javascript
var server = require('http').createServer();

// create our winston logger
var winston = require('winston');
var winstonLogger = new winston.Logger();

// create a transport so our logs have somewhere to go
var TaggedConsoleTarget = require('tagged-console-target');
winston.add(new TaggedConsoleTarget());

// make a new tagged logger to generate tagged log messages
var TaggedLogger = require('tagged-logger');
var logger = new TaggedLogger(winstonLogger, ['my amazing server']);

// Use this module to pipe the events from an http server to the logger
require('winston-tagged-http-logger')(server, log);

// All done! Events from `server` are now being piped to our `logger`!
```

## What events are logged?

* When the server starts running, showing the
  host and port that the server started on.
* When a request is responded to, the client, path, status code, method and
  response time are logged.

## What is the format of the logs?

Why, take a look! Here's an example of a log:

```
19:35:53.255 2013-06-26 Wednesday
19:35:53.589 [kvass, http] Listening on 0.0.0.0:9506
19:36:06.359 [kvass, http, 127.0.0.1:50230] GET /user/active 200 12ms
```

Broken down, these are the parts of a request log:

* `19:36:06.359` the time on the server at which the request was received
* `[kvass, http,` tags that have been assigned to this logger
* `127.0.0.1:50230]` a tag representing the origin of the request
* `GET` the request method
* `/user/active` the requested path
* `200` the response status code
* `12ms` the time it took to respond to the request
