
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  //, user = require('./routes/user')
  , user = require('./lib/middleware/user')
  , register = require('./routes/register')
  , login = require('./routes/login')
  , messages = require('./lib/messages')
  , http = require('http')
  , path = require('path')
  , entries = require('./routes/entries')
  , validate = require('./lib/middleware/validate')
  , page = require('./lib/middleware/page')
  , Entry = require('./lib/entry');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(user);
app.use(messages);
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/post', entries.form);
app.post('/post', 
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit);

app.get('/:page?', page(Entry.count, 5), entries.list); //Using route ':page?' to have / equivalent to /0

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
