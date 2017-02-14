const repl = require('repl');
const stream = require('stream');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// body parser
const jsonParser = bodyParser.json({strict:false});

// serve out static doc
app.use(express.static('public'));

// respond with "hello world" when a GET request is made to the homepage
app.post('/exec', jsonParser,  function (req, res) {

  // create some streams to handle traffic in and out of the repl
  const stdin = new stream.PassThrough;
  const stdout = new stream.PassThrough;

  // repl options, including custom 'writer' function and no prompt
  const options = {
    input: stdin,
    output: stdout,
    writer: function(x) {
      //console.log('writer', 'u',typeof x, 'u');
      return JSON.stringify(x);
 /*     switch(typeof x) {
        case 'function':
          return JSON.stringify('[function]');
          break;
        case 'object':
          if (x instanceof Promise) {
            return JSON.stringify('[Promise]');
          } else 
            return JSON.stringify(x);
          }
          break;
        default:
          return JSON.stringify(x);
      }*/
    },
    prompt: '',
    replMode: repl.REPL_MODE_MAGIC
  };
  
  // start the repl and close the socket when it exits
  var r = repl.start(options).on('exit', function() {
    res.end();
  });
  const _eval = r.eval;
  r.eval = function (cmd, context, filename, callback) {
    const code = require('./lib/preprocess.js')(cmd);
    console.log('code', code);
    _eval(code, context, filename, callback);
  };
  r.context.silverlining = require('silverlining');

  // pipe the repl's output to the response
  stdout.pipe(res);
  
  // write the command(s) to the repl
  stdin.write(req.body);

  // add an '.exit' to ensure the repl dies
  stdin.write('\n.exit\n')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
