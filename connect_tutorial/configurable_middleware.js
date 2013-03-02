var http = require('http');
var connect = require('connect');
var router = require('./router');
var routes = {
  GET: {
    '/users': function(req, res) {
      res.end('tobi, loki, ferret');
    },
    '/user/:id': function(req, res, id) {
      res.end('user ' + id);
    }
  },
  DELETE: {
    '/user/:id': function(req, res, id) {
      res.end('delete user ' + id);
    }
  }
};

var app = connect()
  .use(router(routes));

http.createServer(app).listen(3000); 
