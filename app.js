const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const random = require("./modules/random");
const jwt = require('jsonwebtoken');

require('dotenv').config(); // loading .env config files


const index = require('./routes/index');
const v1api = require("./routes/api");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet.hsts({
  maxAge: 1234000,
  setIf: function (req, res) {
    return req.secure || (req.headers['x-forwarded-proto'] === 'https')
  }
}));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
	secret:random( { length:256 } ), 
	cookie:{ maxAge: 6 * 60 * 60 * 1000 },
	path:'/tmp'
}));
app.use(helmet());


//app.use(logger('dev'));
app.use( (req, res, next) => {
  if( req.url.indexOf("/socket.io") > -1 )
    return;
  next();
} );
app.use(logger("combined"));
//app.use( morganMiddleware );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', v1api); // service api

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
