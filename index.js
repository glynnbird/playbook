
const repl = require('repl');
  
// custom writer function that outputs nothing
var writer = function(output) {
  // don't output anything
  return '';
};

var startRepl = function(instream, outstream) {
  var options = {
    input: instream,
    output: outstream,
    prompt: '> ',
    writer: writer
  }
  var r = repl.start(options);

  // custom print function for Notebook interface
  var print = function(data, variable) {
    // bundle the data into an object
    var obj = { _pixiedust: true, type: 'print', data: data, variable: variable };
    outstream.write(JSON.stringify(obj) + '\n')
  };

  // custom display function for Notebook interface
  var display = function(data, variable) {
    // bundle the data into an object
    var obj = { _pixiedust: true, type: 'display', data: data, variable: variable };
    outstream.write(JSON.stringify(obj) + '\n')
  };

  // add silverlining library and print/display
  r.context.silverlining = require('silverlining');
  r.context.print = print;
  r.context.display = display;
  return r;
}

module.exports = {
  startRepl: startRepl
}


