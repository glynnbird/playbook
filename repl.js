
const repl = require('repl');
  
// start the repl and close the socket when it exits
var r = repl.start();
const _eval = r.eval;
r.eval = function (cmd, context, filename, callback) {
  const code = require('./lib/preprocess.js')(cmd);
  _eval(code, context, filename, callback);
};

// add silverlining library
r.context.silverlining = require('silverlining');

