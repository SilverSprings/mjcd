import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Card } from '../card';
import { RankerService } from '../ranker.service';
//declare var bestHand:any;

//python manage.py runserver 127.0.0.1:8000

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  
  @Output() doneSorting = new EventEmitter<any>();
  
  //player hold the reference of the player's name, number, and position
  @Input() playerNumName:any;

  //hand hold the reference of all the cards dealt to the player
  @Input() hand:any;

  //Just the url to retrieve the blank image of a card  
  
  //handPlayed hold the reference of the cards that the player has placed.  
  firstHandPlayed = {cards:[]};
  middleHandPlayed = {cards:[]};
  lastHandPlayed = {cards:[]};  


  //messages for each hand
  firstMessage:string;
  middleMessage:string;
  lastMessage:string;
  
  handFinal = {fHand:{},mHand:{},lHand:{}};
  
  //disabled the evaluate button
  disableButton = true;

  constructor(private rankerService: RankerService) { }

  ngOnInit() {

	console.log('hand', this.hand);	
	this.firstMessage='';
	this.middleMessage='';
	this.lastMessage='';
  }

  checkHandFirst() {
	console.log ('chechHandFirst', this.firstHandPlayed.cards);
	//swap
	if (this.firstHandPlayed.cards.length == 4) {
		this.hand.cards.push(this.firstHandPlayed.cards[3]);		
		this.firstHandPlayed.cards.splice(3,1)
	}
	console.log ('chechHandFirst--', this.firstHandPlayed.cards);
	
	if (this.firstHandPlayed.cards.length == 3) {
		let handEvaluated = this.evaluateOnTheSpot(this.firstHandPlayed.cards);
		this.firstHandPlayed["handtype"] = handEvaluated.type; 
		this.firstHandPlayed["handValue"] = handEvaluated.val;
		this.firstHandPlayed["handSubValue"] = handEvaluated.subval;
		this.firstMessage = '' + this.firstHandPlayed["handtype"] 
	}
	if (this.firstHandPlayed.cards.length == 3 && this.middleHandPlayed.cards.length == 5) {
		if (this.firstHandPlayed.handSubValue > this.middleHandPlayed.handSubValue) {
			this.firstMessage = 'Careful ! Your first hand is better than your middle hand'
		}
	}
  }
  
  checkHandMiddle() {  
	console.log ('chechHandMiddle', this.middleHandPlayed.cards);
	//swap
	if (this.middleHandPlayed.cards.length == 6) {
		this.hand.cards.push(this.middleHandPlayed.cards[5]);
		this.middleHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandMiddle--', this.middleHandPlayed.cards);
	
	if (this.middleHandPlayed.cards.length == 5) {
		let handEvaluated = this.evaluateOnTheSpot(this.middleHandPlayed.cards);
		this.middleHandPlayed["handtype"] = handEvaluated.type; 
		this.middleHandPlayed["handValue"] = handEvaluated.val;
		this.middleHandPlayed["handSubValue"] = handEvaluated.subval;
		this.middleMessage = '' + this.middleHandPlayed.handtype 
	}
	if (this.middleHandPlayed.cards.length == 5 && this.lastHandPlayed.cards.length == 5) {
		if (this.middleHandPlayed.handSubValue > this.lastHandPlayed.handSubValue) {
			this.middleMessage = 'Careful ! Your middle hand is better than your last hand'
		}
	}	
  }

  checkHandLast() {  
	console.log ('chechHandLast', this.lastHandPlayed.cards);
	//swap
	if (this.lastHandPlayed.cards.length == 6) {
		this.hand.cards.push(this.lastHandPlayed.cards[5]);
		this.lastHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandLast--', this.lastHandPlayed.cards);
	
	if (this.lastHandPlayed.cards.length == 5) {
		let handEvaluated = this.evaluateOnTheSpot(this.lastHandPlayed.cards);
		this.lastHandPlayed["handtype"] = handEvaluated.type; 
		this.lastHandPlayed["handValue"] = handEvaluated.val;
		this.lastHandPlayed["handSubValue"] = handEvaluated.subval;
		this.lastMessage = '' + this.lastHandPlayed.handtype 
	}
  }
  
  evaluate () {
	//firstHand
	console.log('Eval this.firstHandPlayed', this.firstHandPlayed);

    //evaluate middleHand	
	console.log('Eval this.middleHandPlayed', this.middleHandPlayed);

    //evaluate lastHand
	console.log('Eval this.lastHandPlayed', this.lastHandPlayed);
	
	// emit the event with the final hand
	this.handFinal["fHand"] = this.firstHandPlayed;
	this.handFinal["mHand"] = this.middleHandPlayed;
	this.handFinal["lHand"] = this.lastHandPlayed;
	this.handFinal["num"] = this.playerNumName.num;
	this.handFinal["name"] = this.playerNumName.name;	
	this.doneSorting.emit(this.handFinal);
  }

  evaluateOnTheSpot (currentHand) {
 	let tempHandConverted;	
	var tempHand;
	tempHandConverted = this.convertor(currentHand); 
	tempHand = this.rankerService.bestHand(tempHandConverted);
	return { type:tempHand.type, val:tempHand.val, subvalue:tempHand.subval} 
  }
  
  convertor (handToConvert) {  
   var tempCardconverted = handToConvert.map((e) => {
	   var tempCard = {s:'', v:0};
	   tempCard.s = this.suitConvertor(e.suit);
	   tempCard.v = this.valueConvertor(e.value);
	   return tempCard});
   return tempCardconverted;
  }

  suitConvertor (suit) {
	switch(suit)
	{case 'SPADES':return 's';
	 case 'HEARTS':return 'h';
	 case 'CLUBS':return 'c';
	 case 'DIAMONDS':return 'd';
	}		
  }
  
  valueConvertor (value) {
	switch(value)
	{case 'ACE':return 1;
	 case 'KING':return 13;
	 case 'QUEEN':return 12;
	 case 'JACK':return 11;
	 default:return +value;
	}		
  }  
  
}

