var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var helmet = require('helmet');
const mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var appOne = require('./routes/appOne');

var app = express();
app.use(helmet());

let devcsp = [
    'font-src *.gstatic.com',
    'img-src \'self\' data:',
    'script-src \'self\' \'unsafe-eval\'',
    'style-src \'self\' \'unsafe-inline\' *.googleapis.com',
    'default-src \'self\''
];
let prodcsp = [
    'img-src \'self\' data:',
    'script-src \'self\'',
    'style-src \'self\' \'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=\' \'sha256-kFAIUwypIt04FgLyVU63Lcmp2AQimPh/TdYjy04Flxs=\'',
    'default-src \'self\''
];
app.use((req, res, next) => {
    csp = req.app.get('env') === 'development' ? devcsp.join(';') : prodcsp.join(';');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');         // allow from the dev server
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, X-XSRF-TOKEN');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setHeader('Content-Security-Policy', csp);
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/core-app', appOne);

app.use(express.static(path.join(__dirname, 'dist/core-app')));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/phoenix';
mongoose.connect(mongoUri)
        .catch(err => console.error(err.message));

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
