var http = require('http')
  , connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  var parts = authorization.split(' ')
    , scheme = parts[0]
    , auth = new Buffer(parts[1], 'base64').toString().split(':')
    , user = auth[0]
    , pass = auth[1];

  if ('tobi' === user && 'ferret' === pass) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
}

function admin(req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

var app = connect()
  .use(logger)
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)

http.createServer(app).listen(3000); 
