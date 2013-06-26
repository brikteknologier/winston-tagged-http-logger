module.exports = function (app, log) {
  function loggerMiddleware(req, res, next) {
    var startTime = new Date();
    var url = req.url;
    var method = req.method;

    function writeLog() {
      var socketLog = log.createSublogger(
        req.socket.remoteAddress + ":" + req.socket.remotePort);
      socketLog.info([
        method, url, res.statusCode, (new Date() - startTime) + "ms "
      ].join(' '));
    }

    if (res.finished) writeLog()
    else res.on('finish', writeLog);

    if (next) next();
  };

  // follows middleware pattern
  if (app.use) app.use(loggerMiddleware);
  else app.on('request', loggerMiddleware);

  var listen = app.listen;
  app.listen = function () {
    var httpServer = listen.apply(this, arguments);

    httpServer.on('listening', function () {
      var address = httpServer.address();
      log.info("Listening on " + address.address + ":" + address.port);
    });

    return httpServer;
  };
};
