var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.bodyParser())
  .use(function(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.end('thanks!');
  });

http.createServer(app).listen(3000);