var http = require('http');
var qs = require('querystring');
var items = [];

var server = http.createServer(function(req, res) {
  if ('/' == req.url) {
    switch (req.method) {
      case 'GET':
        show(res);
        break;
      case 'POST':
        add(req, res);
        break;
      default:
        badRequest(res);
    }
  } else {
    notFound(res);
  }
});

function show(res) {
  var html = '<h1>Todo List</h1>' +
             '<ul>' +
             items.map(function (item){
              return '<li>' + item + '</li>'
             }).join('') + 
             '</ul>' +
             '<form method="post" action="/">' +
             '<p><input type="text" name="item" /></p>' +
             '</form>';
  res.setHeader('Content-type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function add(req, res) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) { body += chunk });
  req.on('end', function () {
    var obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-type', 'text/plain');
  res.end('Not Found');
}

function badRequest(res) {
  res.statusCode = 404;
  res.setHeader('Content-type', 'text/plain');
  res.end('Bad Request');
}     
      

server.listen(3000);