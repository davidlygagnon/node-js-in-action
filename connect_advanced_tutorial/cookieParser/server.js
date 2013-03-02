var connect = require('connect')
  , http = require('http');


var app = connect()
  .use(connect.cookieParser('tobi is a cool ferret'))
  .use(function(req, res){
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.end('hello\n');
  });

http.createServer(app).listen(3000);