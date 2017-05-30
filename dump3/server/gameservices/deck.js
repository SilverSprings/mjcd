var newdeckshuffled = function newDeckShuffled(room) {
	var cards = cardsShuffled();
	console.log('', room);
	// return the deck with 4 hands of 13 cards shuffled 
	var hand1 = {
		hName:"HAND_" + randomString(8),
		hCards:cards.slice(0,13),
		hPlayer:room.rPlayers[0]
	}
	var hand2 = {
		hName:"HAND_" + randomString(8),
		hCards:cards.slice(13,26),	
		hPlayer:room.rPlayers[1]
	}
	var hand3 = {
		hName:"HAND_" + randomString(8),
		hCards:cards.slice(26,39),
		hPlayer:room.rPlayers[2]	
	}	
	var hand4 = {
		hName:"HAND_" + randomString(8),
		hCards:cards.slice(39,52),
		hPlayer:room.rPlayers[3]		
	}
    var tempArray = [];
    tempArray.push(hand1,hand2, hand3, hand4);	
	var deckName = "DECK_" + randomString(8);
	var deck = {dId:deckName, dRoom:room.rId, dHand:tempArray};		
    return deck;
}

function cardsShuffled() {
	var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
	//heart"&#9829" - diamond"&#9830" - spade"&#9824" - club"&#9827"
	var cardsHeart   = values.map( (r) => {return {value:r, suit:"h"}} ); 
	var cardsDiamond = values.map( (r) => {return {value:r, suit:"d"}} ); 
	var cardsSpade   = values.map( (r) => {return {value:r, suit:"s"}} ); 
	var cardsClub    = values.map( (r) => {return {value:r, suit:"c"}} ); 
    var cards = cardsHeart.concat(cardsDiamond,cardsSpade,cardsClub);
	/*cards = [
		{value:"A", suit:"h"},...,{value:"K", suit:"h"}
		{value:"A", suit:"d"},...,{value:"K", suit:"d"}
		{value:"A", suit:"s"},...,{value:"K", suit:"s"}
		{value:"A", suit:"c"},...,{value:"K", suit:"c"}		
	]*/
	//Shuffle
	for(var i = 51; i >= 1; i--) {
		var j = randomInt(i);
		var tmpCard = cards[j];
		cards[j] = cards[i];
		cards[i] = tmpCard;
	}	
	return cards;
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(randomInt(62));
    }
    return text;
}  

function randomInt(rnd){
    return Math.floor(Math.random() * rnd);
}

module.exports = newdeckshuffled;



