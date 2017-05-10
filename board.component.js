import { Component, OnInit } from '@angular/core';
import { CardsService } from '../cards.service';
import { RankerService } from '../ranker.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [CardsService, RankerService]
})
export class BoardComponent implements OnInit {
  
  @Input() playerNames;
  @@Output() showResults = new EventEmitter<any>();
  deck:any;
  readyToPlay = false;
  playerNumName = [];
  hands: any = [];  
  
  allHands = [];
  
  constructor(private cardsService: CardsService) { }

  ngOnInit() {
  	// Populate playerNumName
	this.playerNumName = [{num:1, name:this.playerNames.humanPlayer},
						  {num:2, name:this.playerNames.cpuLeft},
						  {num:3, name:this.playerNames.cpuMiddle},
						  {num:4, name:this.playerNames.cpuRight},
	];
	
	this.readyToPlay = false;
	
	// Retrieve a new deck from the API
    this.cardsService.newDeck().subscribe(deck => {
		// Player 1 hand
		this.cardsService.newHand(deck).subscribe(hand => {
			this.hands[0]=hand; 
			// Player 2 hand
			this.cardsService.newHand(deck).subscribe(hand => {
				this.hands[1]=hand;
				// Player 3 hand
				this.cardsService.newHand(deck).subscribe(hand => {
					this.hands[2]=hand;
					// Player 4 hand
					this.cardsService.newHand(deck).subscribe(hand => {
						this.hands[3]=hand;
						// All hands have been drawn
						this.deck=deck;
					});
				});
			});
		});
	});	

	// Init of this.hand
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	for (let _p = 0; _p < 4; _p++) {
		for (let _j = 0; _j < 13; _j++) {	
			this.hands[_p].cards[_j].image = this.hands[_p].cards[_j].image.replace(urlToReplace, urlOfServer);	
		}
	}
	this.readyToPlay = true;
  }
   
  handReadyPlayer(handPlayer) {
	console.log('in handReadyPlayer', handPlayer);
	this.allHands.push(handPlayer);
  }
  
  humanPlayerReady(handPlayer) {
	console.log('in handReadyPlayer', handPlayer);
	this.allHands.push(handPlayer);
	//this.showResults.emit(this.allHands);
  }
  
  tempShowResults() {
	this.showResults.emit(this.allHands);
  }
}
