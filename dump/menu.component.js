import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [RoomService]  
})

export class MenuComponent implements OnInit {

  constructor(private roomService: RoomService) { }
  
  playerNamesCPU:{humanPlayer:string, cpuLeft:string, cpuMiddle:string, cpuRight:string} ;
  playerName;
  noNameProvided:boolean;
  gameCPUInProgress:boolean;
  gameInProgress:boolean;
  rulesHidden:boolean;
  playingCPU:boolean;
  rooms:[];
  roomSelected:null;
  //{roomId:0, name:'London', seats:0, players:[], deckInUse:''}
  
  ngOnInit() {
	this.playerNameCPU = {humanPlayer:'', cpuLeft:'Izquierda', cpuMiddle:'Mezzo', cpuRight:'Recht'} ;	
	this.noNameProvided = true;
	this.gameCPUInProgress = false;
    this.gameInProgress = false;
	this.rulesHidden = true;
	this.roomService.allRooms().subscribe(rooms => this.rooms = rooms.filter( r => r.seats != 4 ));
    this.playerName = '';
  }

  startGameCPU(inputPlayerName) {
	this.noNameProvided = false;
	this.playerNamesCPU.humanPlayer = inputPlayerName;
	this.gameCPUInProgress = true;
  }
  
  startGame(inputPlayerName) {
	this.noNameProvided = false;
	this.playerName = inputPlayerName;
	let pInR = {playerName:inputPlayerName, roomId:this.roomSelected.roomId}
	this.roomService.addPlayerInRoom(pInR).subscribe(room => this.roomSelected = room);
	this.gameInProgress = true;
  }  
  
  endGame() {
	this.noNameProvided = true;
	this.playerNamesCPU.humanPlayer = '';
	this.gameCPUInProgress = false;
	this.gameInProgress = false;	
	this.roomService.allRooms().subscribe(rooms => this.rooms = rooms.filter( r => r.seats != 4 ));
  }
  
  showRules() {
	this.rulesHidden = false;
  }
  
  hideRules() {
	this.rulesHidden = true;
  }
  
}