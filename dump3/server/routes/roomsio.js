//gameservices - homebrew modules
//var cleanup = require('./server/gameservices/cleanup');

var socketPlayer = [];

var roomconnect = (io) => {
		io.on('connection', (socket) => {
			console.log('somebody is connected - socket.id:'+socket.id);
			// LISTEN : a player disconnection
			socket.on('disconnect', () => {console.log('somebody is disconnected - socket.id:'+socket.id);});
			// LISTEN : a player has entered a room
			socket.on('joinroom', (player) => {	socket.join(player.rId);
												// EMIT : tell the room somebody is coming in
												io.to(player.rId).emit('playercomein', player);											
			});
			// LISTEN : a player has left a room
			socket.on('leaveroom', (player) => { socket.leave(player.rId);
												// EMIT : tell the room somebody has left
												io.to(player.rId).emit('playerleft', player);													
			});
			// LISTEN : a player is ready to showdown
			socket.on('playerSD', (player) => { // EMIT : tell the room somebody is ready to showdown
												io.to(player.rId).emit('playerSD', player);													
			});
		});
}
module.exports = roomconnect;