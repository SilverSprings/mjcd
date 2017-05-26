import { Component, OnInit} from '@angular/core';
import { Player } from './model/player';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [RoomService]  
})

export class MenuComponent implements OnInit {

  constructor(private roomService: RoomService) { }
  
  playerNamesCPU:{humanPlayer:string, cpuLeft:string, cpuMiddle:string, cpuRight:string} ;
  player:Player;
  gameCPUInProgress:boolean;
  gameInProgress:boolean;
  rulesHidden:boolean;
  registeredPlayer:boolean;
  chooseAnotherRoom:boolean;
  rooms:[];
  roomSelected:null;
  room;
  //{roomId:0, name:'London', seats:0, players:[], deckInUse:''}
  
  ngOnInit() {
	this.playerNamesCPU = {humanPlayer:'', cpuLeft:'Izquierda', cpuMiddle:'Mezzo', cpuRight:'Recht'} ;	
	this.gameCPUInProgress = false;
    this.gameInProgress = false;
	this.registeredPlayer = false;
	this.rulesHidden = true;
	this.chooseAnotherRoom = false;
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);
    this.player = {	pId:'',
					pRoom:'',
					pName:'',
					pReady:false,
					pSD:false,
					pHand:''
	};
  }
  
  
  
  registerPlayer(inputPlayerName : string) {
	this.player.pName = inputPlayerName; 
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);	
	this.registeredPlayer = true;
}

  startGameCPU() {
	this.playerNamesCPU.humanPlayer = this.player.pName;
	this.gameCPUInProgress = true;
  }
  
  startGame() {
	this.roomService.retrieveRoom(this.roomSelected.rId).subscribe( room => {
		if (room.rSeats < 4 ) {
			this.roomService.addPlayer(this.player).subscribe( player => {
				this.player = player;
				this.roomService.addPlayerInRoom(this.player).subscribe(room => {
					this.room = room;
					this.player.pRoom = room.rId;
					this.gameInProgress = true;
				});
			});
		} else {
			this.chooseAnotherRoom = true;
			this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);			
		}
	}
  }  

  endGameCPU() {	
	this.playerNamesCPU.humanPlayer = '';
	this.gameCPUInProgress = false;	
  }
  
  endGame() {
	this.roomService.removePlayerInRoom(this.player).subscribe(room => console.log('Player '+this.player.pName +'left the room'+room.rId));	
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);
	this.gameCPUInProgress = false;	
  }
  
  showRules() {
	this.rulesHidden = false;
  }
  
  hideRules() {
	this.rulesHidden = true;
  }

}