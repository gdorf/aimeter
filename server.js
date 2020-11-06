var express = require('express');

var app = express();
var server = app.listen(3000);

var tot = 0.5
var numopinions = 1;

var recent = [];

app.use(express.static('public'));

console.log("My socket server is running!");

var socket  = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('opinion', newOpinion);
  io.sockets.emit('curropinion', (tot / numopinions));
}

function newOpinion(data) {
  io.sockets.emit('opinion', getAverage(data.val));
  io.sockets.emit('opinionupdate', data.str);
  console.log(tot);


}

function getAverage(curr) {
  tot += curr;
  numopinions++;
  return tot / numopinions;
}
