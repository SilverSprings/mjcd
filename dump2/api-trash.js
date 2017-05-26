const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');

// using http://deckofcardsapi.com/

router.get('/newdeck', (req, res) => {
	console.log('api newdeck');
	axios.get('http://127.0.0.1:8000/api/deck/new/shuffle/?deck_count=1')
		 .then(deck => {console.log(deck.data);
						res.status(200).json(deck.data);
		 })
		 .catch(error => {res.status(500).send(error)});
});

router.post('/newhand', (req, res) => {
	console.log('api newhand', req.body);
	axios.get('http://127.0.0.1:8000/api/deck/'+req.body.deck_id+'/draw/?count=13')
		 .then(hand => {console.log(hand.data);
						res.status(200).json(hand.data);
		 })
		 .catch(error => {res.status(500).send(error)});
});


// special multiplayer
var roomsInit =[{roomId:0, name:'London', seats:0, deckInUse:{}, allHands:[],
				 players:[{pId:0,pName:'',pReady:false,pSD:false},{pId:1,pName:'',pReady:false,pSD:false},{pId:2,pName:'',pReady:false,pSD:false},{pId:3,pName:'',pReady:false,pSD:false}]},
				{roomId:1, name:'Paris ', seats:0, deckInUse:{}, allHands:[],
				 players:[{pId:0,pName:'',pReady:false,pSD:false},{pId:1,pName:'',pReady:false,pSD:false},{pId:2,pName:'',pReady:false,pSD:false},{pId:3,pName:'',,pReady:false,pSD:false}]}
];

var rooms = [	{roomId:0, name:'London', seats:0, deckInUse:{}, allHands:[],
				 players:[{pId:0,pName:'',pReady:false,pSD:false},{pId:1,pName:'',pReady:false,pSD:false},{pId:2,pName:'',pReady:false,pSD:false},{pId:3,pName:'',pReady:false,pSD:false}]},
				{roomId:1, name:'Paris ', seats:0, deckInUse:{}, allHands:[],
				 players:[{pId:0,pName:'',pReady:false,pSD:false},{pId:1,pName:'',pReady:false,pSD:false},{pId:2,pName:'',pReady:false,pSD:false},{pId:3,pName:'',,pReady:false,pSD:false}]}
];



router.get('/allrooms', (req, res) => {
	console.log('api allrooms', req.body);
	res.status(200).json(rooms);
});

router.post('/addplayerinroom', (req, res) => {
	console.log('api addplayerinroom', req.body);
	let pIdtemp;
	for (let _p = 0; _p < 4; _p++) {
		if(rooms[req.body.roomId].players[_p].pName = '') {
			rooms[req.body.roomId].players[_p].pName = req.body.playerName;
			rooms[req.body.roomId].players[_p].pReady = false;
			rooms[req.body.roomId].players[_p].pSD = false;
			pIdtemp = rooms[req.body.roomId].players[_p].pId;
			break;
		}
	}	
	rooms[req.body.roomId].seats++;
	res.status(200).json(pIdtemp);
});

router.post('/removeplayerinroom', (req, res) => {
	console.log('api removeplayerinroom', req.body);
	for (let _p = 0; _p < 4; _p++) {
		if(rooms[req.body.roomId].players[_p].pId = req.body.pId) {
			rooms[req.body.roomId].players[_p].pName = '';
			rooms[req.body.roomId].players[_p].pReady = false;
			rooms[req.body.roomId].players[_p].pSD = false;			
			break;
		}
	}
	rooms[req.body.roomId].seats--;
	res.status(200).json(rooms[req.body.roomId]);
});

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let london = io.of('/London');
let paris = io.of('/Paris');


london.on('connection', (socket) => {
  console.log('user connected in london');
  
  socket.on('disconnect', function(){
    console.log('user disconnected from london');
  });

  // pInR = {roomId:0,pName:'Alonzo',pId:1};  
  socket.on('iAmReady', (pInR) => {
    rooms[0].players[pInR.pId].pReady = true;
	if (rooms[0].players.every(p => p.Ready)) {
		console.log('api newdeck');
		axios.get('http://127.0.0.1:8000/api/deck/new/shuffle/?deck_count=1')
			.then(deck => {console.log(deck.data);
						   rooms[pInR.roomId].deckInUse = deck.data;
			})
			.catch(error => {console.log(error)});		
	}
	london.emit('roomState', rooms[pInR.roomId]);
  });
  
  socket.on('playerReadytoSD', (handFinal) => {
	rooms[0].allHands.push(handFinal);
	rooms[0].players[handFinal.num].pSD = true;
	london.emit('roomState', rooms[pInR.roomId]);	
  });
  
});

/*


// mongoDB part
var MongoObjectID = require("mongodb").ObjectID; 

var MongoClient = require("mongodb").MongoClient;

var db;
var coll;

MongoClient.connect("mongodb://127.0.0.1/game", function(error, datab) {
	if (error) console.log("ERREUR : " + error);
	db = datab;
	coll = db.collection("posts");
	console.log ('connexion mongoDB réussie');
});

/* GET api listing. 
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
	coll.find().toArray((err, results) => {
		if (err) throw err;
		console.log('find all posts ok');
		res.status(200).send(results);
	});
});


// delete a post
router.delete('/removePost', (req, res) => {
	console.log('In the delete function', req.body);
	console.log(req.body._id);
	x = new MongoObjectID(req.body._id);
	console.log(x);
	coll.remove({_id:x}, null, (err, result) => {
		if (err) throw err;
		console.log('remove ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});

// add a post or update
router.post('/addPost', (req, res) => {
	console.log('In the add function', req.body);
	coll.save(req.body, null, (err, result) => {
		if (err) throw err;
		console.log('add ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});

// add a post or update
router.post('/updPost', (req, res) => {
	req.body._id = new MongoObjectID(req.body._id);
	console.log('In the upd function', req.body);
	coll.save(req.body, null, (err, result) => {
		if (err) throw err;
		console.log('upd ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});
*/

// permet à ce que ce fichier devienne un module et soit utiliser par d'autres qui l'appelleront grâce à require
module.exports = router;
