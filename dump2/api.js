const express = require('express');
const router = express.Router();

//gameservices - homebrew modules
var deck = require('./server/gameservices/deck');
var newplayer = require('.server/gameservices/newplayer.js');

//mongoDB
var mgID = require("mongodb").ObjectID; 
var mgClient = require("mongodb").MongoClient;
var db;
var roomsColl;
var playersColl;
var deckColl;
var handsColl;

//Connect to mongoDB
mgClient.connect("mongodb://127.0.0.1/game", (error, datab) => {
		if (error) {console.log("ERREUR connexion mongoDB: " + error); res.status(500);}
		db = datab;
		roomsColl = db.collection('rooms');
		playersColl= db.collection('players');
		decksColl = db.collection('decks');
		handsColl = db.collection('hands');		
		console.log ('connexion mongoDB réussie');
});

//ROUTE : '/addplayer' 
router.post('/addplayer', (req, res) => {
		// TEST : the player name must be provided
		if (!req.body.pName) {console.log('/addplayer : no player name provided'+req.body); res.status(500);} 
		// SERVICE : create a new player
		var tempPlayer = newplayer(req.body.pName);
		// MONGODB : insert that new player in the 'players' collection
		playersColl.insertOne(tempPlayer, (err, result) => {
			if (err) throw err;
			console.log('/addplayer : player added' + result)			
		});			
		// RESPONSE : the new player created
		res.status(200).send(tempPlayer);
});

//Remove a player  
router.post('/removeplayer', (req, res) => {
		if (!req.body.pId) {console.log('/removeplayer : no player Id provided'+req.body); res.status(500);}
		var tempPlayer = req.body;		
		playersColl.deleteOne( {pId : req.body.pId}, (err, result) => {
			if (err) throw err;
			console.log('/removeplayer : player removed' + result)			
		});
		res.status(200).send(tempPlayer);
});

// Retrieve all available rooms, where the number of seats already taken is < 4
router.get('/availablerooms', (req, res) => {
	console.log('a request has been made to retrieve all available rooms');
	var cursor = roomsColl.find( { rSeats: { $lt:4}} );
	cursor.toArray((err, results) => {
		if (err) throw err;
		console.log('find all rooms ok');
		res.status(200).send(results);
	});
});

// Get a particular room
router.post('/retrieveroom', (req, res) => {
	if ( !req.body.rId) {console.log('/retrieveroom : no room Id provided' + req.body); res.status(500);}
	roomsColl.findOne( 	{rId : req.body.rId} , 
						null ,
						(err, room) => {
							if (err) throw err;
							console.log('room retrieved '+result);
							res.status(200).send(room);
						}
	);
});

// add a the player in a room and update the player room
router.post('/addplayerinroom', (req, res) => {
	// check if the room ID and Player ID are provided
	if ( !req.body.pRoom) {console.log('/addplayerinroom : no room Id provided'+req.body); res.status(500);}
	if ( !req.body.pId) {console.log('/addplayerinroom : no player Id provided'+req.body); res.status(500);}
	console.log('player '+req.body.pId+ ' wants to enter '+ req.body.pRoom);

	// add +1 to the seats occupied in the room and add a player in the room 
	roomsColl.updateOne( {rId : req.body.pRoom},
				 {$push : {rPlayers : req.body.pId }, $inc : { rSeats : 1}}, 
				 (err, result) => { 
					if (err) throw err;
					console.log('/addplayerinroom update of room has been done :' + result);
				}
	);
	
	// update the player room
	playersColl.updateOne( {pId : req.body.pId},
						{$set : {pRoom : req.body.pRoom}}, 
						(err, result) => { 
							if (err) throw err;
							console.log('/addplayerinroom : update of player has been done :' + result + ' player is now in ' + roomTemp.rName);
						}
	);
	
	// check the room number of seats taken 
	var roomTemp = {};
	roomsColl.findOne( 	{rId : req.body.pRoom} , 
						null ,
						(err, result) => {
							if (err) throw err;
							roomTemp = result;
						}
	);	

	// if all seats are taken in the room, a new deck is required
	if (roomTemp.rSeats == 4) {
		tempDeck = deck(roomTemp);
		//Insert a new deck 
		decksColl.insertOne(tempDeck, (err, result) => {
			if (err) throw err;
			console.log('/addplayerinroom : deck inserted' + result)			
		});
		//insert every hand
		handsColl.insert(tempDeck.dHand, (err, result) => {
			if (err) throw err;
			console.log('/addplayerinroom : deck inserted' + result)			
		});
		//update room with the deck ID
		roomsColl.updateOne({ rId : roomTemp.rId},
							{ $set : {rDeck:tempDeck.dId}},
							(err, result) => { 
								if (err) throw err;
								console.log('/addplayerinroom update of deck for room has been done :' + result);
							}								
		);
		//update every player with a hand
		for(var p = 0; p < 4; p--)
			playersColl.updateOne({ pId : roomTemp.rPlayers[p]},
								  { $set : {pHand:tempDeck.dHand[p]}},
								  (err, result) => { 
									if (err) throw err;
									console.log('/addplayerinroom update of player with hand done :' + result);
								  }								 	
		);
	}	
	
	res.status(200).send(roomTemp);
});

// remove a player from a room and update the player room
router.post('/removeplayerinroom', (req, res) => {
	if ( !req.body.pRoom) {console.log('/addplayerinroom : no room Id provided'+req.body); res.status(500);}
	if ( !req.body.pId) {console.log('/addplayerinroom : no player Id provided'+req.body); res.status(500);}
	console.log('player '+req.body.pId+ ' wants to enter '+ req.body.pRoom);

	roomsColl.updateOne( {rId : req.body.pRoom},
				 {$pull : {rPlayers : req.body.pId }, $inc : { rSeats : -1}}, 
				 (err, result) => { 
					if (err) throw err;
					console.log('/removeplayerinroom update of room has been done :' + result);
				}
	);

	var roomTemp = {};
	roomsColl.findOne( 	{rId : req.body.pRoom} , 
						null ,
						(err, result) => {
							if (err) throw err;
							roomTemp = result;
							console.log('/removeplayerinroom : player '+req.body.pId+ ' has been removed '+ result.rId 'aka' + result.rName);
						}
	);	
	
	playersColl.updateOne(	{pId : req.body.pId},
							{$set : {pRoom : '', pReady:false, pSD:false, pHand : ''}}, 
							(err, result) => { 
								if (err) throw err;
								console.log('/removeplayerinroom : update of player has been done :' + result + ' player is now in ' + roomTemp.rName);
							}
	);
	
	res.status(200).send(roomTemp);
});

router.post('/newdeckshuffled', (req, res) => {
	if ( !req.body.rId) res.status(500);
	console.log('a new desk has been asked for room'+ req.body.rId);
	var tempDeck = deck();
	res.status(200).json(tempDeck);
});

router.post('/newhand', (req, res) => {
});

module.exports = router;
