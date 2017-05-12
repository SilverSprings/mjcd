import { Component, OnInit, Input } from '@angular/core';
import { RoomService } from '../room.service';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-cityroom',
  templateUrl: './cityroom.component.html',
  styleUrls: ['./cityroom.component.css'],
  providers: [RoomService]  
})

export class CityroomComponent implements OnInit {
  
  constructor(private roomService:RoomService) {}
   
  @Input() room;
  //{roomId:0, name:'London', seats:0, players:[], deckInUse:''}
  @Input() gameLoad;
  @input() playerName;
  pointsByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  playersReady:{p1:boolean,p2:boolean, p3:boolean, p4:boolean};
  allHands:any;
  socket;
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
	this.pointsByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
	this.socket = io();
  }
  
  
  playerReady() {
	this.roomService.statePlayerReady().subscribe(playersReady => this.playerReady = playersReady);
  }
  
  showResults(allHandsDelivered) {
	this.allHands = allHandsDelivered.sort( a,b => a.num - b.num );  
	this.gameLoad = false;
  }
  
  playAgain(pointsByPlayer) {
	this.gameLoad = true;
	this.allHands = false;
	this.pointsByPlayer = pointsByPlayer; 
  }
}