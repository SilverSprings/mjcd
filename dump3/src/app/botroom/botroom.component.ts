import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-botroom',
  templateUrl: './botroom.component.html',
  styleUrls: ['./botroom.component.css']
})
export class BotroomComponent implements OnInit {

  constructor(private cardService:CardService) { }
  
  @Input() playerName;
  pointsByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
  allHands:any;
  
  deck:any;
  readyToPlay = false;
  playerNumName = [];
  hands = [];   
  


  ngOnInit() {
	var botNames = {botLeft:'Izquierda', botMiddle:'Mezzo', botRight:'Recht'} ;	
	var botRoom = {
		rId:"ROOM_BOTROOM", 
		rName:'BOTROOM', 
		rSeats:4, 
		rDeck:'',
		rPlayers:['PLAYER_HUMAN','PLAYER_BOTLEFT','PLAYER_BOTMID','PLAYER_BOTRIGHT'] }
	
  	// Populate playerNumName
	/*this.playerNumName = [{num:1, name:this.playerNames.humanPlayer},
						  {num:2, name:this.playerNames.cpuLeft},
						  {num:3, name:this.playerNames.cpuMiddle},
						  {num:4, name:this.playerNames.cpuRight},
	];*/
	
	this.readyToPlay = false;	  
	// Retrieve a new deck from the API
    this.cardService.newDeck(botRoom).subscribe(deck => this.deck=deck); 
	console.log(this.deck);
  }

}
