'use strict';

var express = require("express");
var app = express();

var http = require('http');
var path = require('path');
var favicon          = require('serve-favicon');
var serveStatic      = require('serve-static');

app.use(serveStatic(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next)
{
	console.error(__filename + " : " + err.message);
	res.status(err.status || 500).send({ error: err.message });
});

// all environments
app.set('port', process.env.PORT || 3031);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
