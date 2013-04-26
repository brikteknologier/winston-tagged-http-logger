module.exports = function (app, log) {
  var listen = app.listen;
  app.listen = function () {
    app.listen = listen;

    var httpServer = listen.apply(this, arguments);

    httpServer.on('listening', function () {
      var address = httpServer.address();
      log.info("Listening on " + address.address + ":" + address.port);
    });

    httpServer.on('request', function (req, res) {
      var startTime = new Date();

      var end = res.end;
      res.end = function(chunk, encoding) {
        res.end = end;
        res.end(chunk, encoding);
        var socketLog = log.createSublogger(
          req.socket.remoteAddress + ":" + req.socket.remotePort);
        socketLog.info([
          req.method, req.url, res.statusCode, (new Date() - startTime) + "ms "
        ].join(' '));
      };
    });

    return httpServer;
  };
};
