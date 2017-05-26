/*-------------------------------------------------------------------*/
/*                                                                   */
/*   	                  Chinese Poker Online                       */ 
/*                                                                   */
/*-------------------------------------------------------------------*/

/*-------- REQUIRE() ------------------------------------------------*/
// EXPRESS
// 'app' will be the handler : he will contain all our middleware
var express = require('express');
var app = express();

// PATH
// 'path' will be used to normalize the path to any directory  
var path = require('path');

// SERVER
// 'server' will be the http server
var http = require('http');
var server = http.createServer();

// BODYPARSER
// 'bodyParser' parse the message body content of all incoming request
// bodyParser.urlencoded() when content-type:application/x-www-form-urlencoded (not used)
// bodyParser.json() when content-type:application/json  
var bodyParser = require('body-parser');

// SOCKET.IO
// 'io' will be used to emit and listen to real time event 
// 'server' is provided to 'io'
var io = require('socket.io')(server);
var roomsio = ('./server/routes/roomsio')(io);
  
// API + MONGODB
// 'api' will contain the end points where all requests get caught. 
var api = require('./server/routes/api');


/*-------- MIDDLEWARES ----------------------------------------------*/

// add the middleware bodyParser.json() in 'app'
// any request with a body with content-type:application/json is parsed  
app.use(bodyParser.json());

// add the built-in middleware express.static('http://www..com/folder') to 'app'
// express.static is used to serve static files : html, css, jpg, js
// path is used to join 2 strings: 
//      _dirname, which is the directory name of the current module : server.js 
// 		'dist', which is the destination folder when Angular builds the application
app.use(express.static(path.join(__dirname, 'dist')));

// add all the middleware of 'api' in 'app' . 
// the middlewares of 'api' will be called only if the request path begins with '/api'
app.use('/api', api);

// add all the missdleware of 'roomsio' in 'app'
// the middlewares of 'roomsio' will be called for every request
app.use(roomsio);

// catch all other routes that haven not been caught and return the 404 file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/notFound.html'));
});



/*-------- PORT AND LISTEN -------------------------------------------*/


// Get port from environment and store in Express.
// process.env holds the variables of the process currently running
// app.set('x',y) allows us to define properties for the app instance 

var port = process.env.PORT || '3000';
app.set('port', port);

// we define the handler 'server', which is 'app'
server(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log('API running on localhost:' + port));