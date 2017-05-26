import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../room.service';



@Component({
  selector: 'app-cityroom',
  templateUrl: './cityroom.component.html',
  styleUrls: ['./cityroom.component.css'],
  providers: [SocketService]  
})

export class CityroomComponent implements OnInit {
  
  constructor(private socketService:SocketService) {}

  @input() room;
  @input() player;

  pointsByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  otherPlayers:[];
  allHands:any;
  showResults:boolean;
  
  /* allHands=[{
				fHand: {cards:[...],
						handType:'One Pair',
						handValue:1,
						handSubValue:1141404},				
				mHand: {cards:[...],
						handType:'Straight',
						handValue:4,
						handSubValue:40908070605},				
				lHand: {cards:[{image:'https...', value:'Ace', suit:'HEARTS', code:'AH'},
							   {image:'https...', value:'King', suit:'HEARTS', code:'KH'},
							   {image:'https...', value:'Queen', suit:'HEARTS', code:'QH'},
							   {image:'https...', value:'Jack', suit:'HEARTS', code:'QH'},  
							   {image:'https...', value:'10', suit:'HEARTS', code:'10H'}],
						handType:'Straight Flush',
						handValue:8,
						handSubValue:81413121110},
				num:1,
				name:'SomeName1'},
				{...},{...},{...}]
  */
  
  ngOnInit() {
  
	this.allHands = false;
	this.gameLoad = false;
	this.playerReady = false;
	this.pointsByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
	this.socketService.playerComeIn().subscribe(player => {});
	this.socketService.joinRoom(this.player);
	
	
	/*.subscribe((room) => {
		this.room = room;
		this.otherPlayers = room.players.filter( p => p.pId != this.pInR.pId);
		this.gameLoad = room.players.every(p => p.pReady);
		this.showResults = room.players.every(p => p.pSD);
		if (this.showResults) this.allHands = room.allHands;
	});*/
  }
    
  playerReadytoSD(handFinal) {
	this.roomService.playerReadytoSD(handFinal);
  }
  
  playAgain(pointsByPlayer) {
	this.gameLoad = true;
	this.allHands = false;
	this.pointsByPlayer = pointsByPlayer; 
  }
}