#!/usr/bin/env node
var repl = require('..');
var net = require('net');

net.createServer(function (socket) {
  var r  = repl.startRepl(socket, socket);
  r.on('exit', function () {
    socket.end()
  });
}).listen(1337)
console.log('REPL server listening on port 1337');
console.log('Try: telnet localhost 1337');