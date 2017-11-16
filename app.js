var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var winston = require('winston');

var nunjucks = require('nunjucks');

/* Mail winston added, later giving settings */
// require('winston-mail').Mail; // nothing extra needed, winston-mail will add itself to the winston.transports

winston.add(winston.transports.File, {'filename': 'error.log', 'level': nconf.get('loggerl:filelevel')});

/* Mail settings */
// winston.add(winston.transports.Mail, {
//     'to': 'test@mail.com',
//     'username': 'smtp_username',
//     'password': 'smtp_password',
//     'level': 'error'
// });

// winston.error('something went wrong'); // test to see if file etc works.

/* Winston Profiler */
// winston.profile('test');
/* When ran again, it will show elapsed time between */
// setTimeout(function () {
//     winston.profile('test');
// }, 1000);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// First in, first serve
// when you want full control over others. (make it non configurable)
// when using some other command, this will override anyway
// nconf.overrides({
//     'http': {
//       'port': 9000
//     }
// });

// use this command: `http__port=8001 bin/www -p 8002`
nconf.argv({
    'p': {
        'alias': 'http:port',
        'describe': 'The port to listen on'
    }
});

nconf.env('__'); // use this command: `http__port=8001 bin/www`

nconf.file('config.json');

nconf.defaults({
    'http': {
      'port': 3000
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
