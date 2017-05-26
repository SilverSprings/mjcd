import { Component, OnInit } from '@angular/core';
import { CardsService } from '../cards.service';
import { RankerService } from '../ranker.service';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-cityboard',
  templateUrl: './cityboard.component.html',
  styleUrls: ['./cityboard.component.css'],
  providers: [CardsService, RankerService, RoomService]
})
export class CityboardComponent implements OnInit {
  
  @Input() room;
  //{roomId:0, name:'London', seats:4, deckInUse:{deck_id:'xxxaxaxaxaxaxa', shuffled:true, remaining:52, success:true },
  // players:[{pId:0,pName:'xxxxx',pReady:true,pSD:false},{pId:1,pName:'yyyyy',pReady:true,pSD:false},{pId:2,pName:'yyyyy',pReady:true,pSD:false},{pId:3,pName:'yyyyyy',pReady:true,pSD:false}]}
  @Input() otherPlayers;
  @Input() pInR;
  @Output() playerSD = new EventEmitter<any>();
  urlOfCoverStackImg3:string;
  urlOfCoverStackImg:string;
  readyToPlay = false;
  hand: any = [];  
  
  
  constructor(private cardsService: CardsService) { }

  ngOnInit() {
	this.urlOfCoverStackImg3 = 'http://127.0.0.1:8000/static/img/coverbluestacklayed.png';  
	this.urlOfCoverStackImg = 'http://127.0.0.1:8000/static/img/coverbluestack.png';
	this.readyToPlay = false;
	

	
	// Init of this.hand
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	// Retrieve a hand using the API  	
	this.cardsService.newHand(this.room.deck).subscribe(hand => {
		this.hand = hand;
	});
	
	for (let _j = 0; _j < 13; _j++) {	
		this.hand.cards[_j].image = this.hands.cards[_j].image.replace(urlToReplace, urlOfServer);	
	}
	
	this.readyToPlay = true;
  }
  
  humanPlayerReady(handFinal) {
	this.playerSD.emit(handFinal);
  }
}
