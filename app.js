var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3020;


var myPort = new SerialPort("COM3", {
   baudRate: 9600,
   parser: serialport.parsers.readline("\n")
});

myPort.on('open', function(error){
  if(error){
    throw error;
    console.log('Serial Port Error: ' + error);
  }else{
    console.log('Serial Port Opend');
    
    io.sockets.on('connection', function(socket){
      console.log("New Client Connected");

      socket.on("led-on", function(){
        myPort.write("1");
        console.log("Turning On LED");
      });

      socket.on("led-off", function(){
        myPort.write("0");
        console.log("Turning Off LED")
      });

    });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(port, function(){
    console.log("Web Socket running in port: "+port);      
});

module.exports = app;