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
  @Output() showResults = new EventEmitter<any>();
  deck:any;
  readyToPlay = false;
  playerNumName = [];
  hands: any = [];  
  
  allHands = [];
  
  constructor(private cardsService: CardsService) { }

  ngOnInit() {

	this.readyToPlay = false;
	// Retrieve the deck and hand from the room, using the API  

	// Init of this.hand
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	for (let _j = 0; _j < 13; _j++) {	
		this.hands[_p].cards[_j].image = this.hands[_p].cards[_j].image.replace(urlToReplace, urlOfServer);	
	}
  }
  
  playerReady() {
	this.readyToPlay = true;
  }
}
