import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  
  playerNames:{humanPlayer:string, cpuLeft:string, cpuMiddle:string, cpuRight:string} ;
  noNameProvided:boolean;
  gameInProgress:boolean;
  rulesHidden:boolean;
  
  ngOnInit() {
	this.playerName = {humanPlayer:'', cpuLeft:'Izquierda', cpuMiddle:'Mezzo', cpuRight:'Recht'} ;	
	this.noNameProvided = true;
	this.gameInProgress = false;
	this.rulesHidden = true;
  }

  startGame(inputPlayerName) {
	this.noNameProvided = false;
	this.playerNames.humanPlayer = inputPlayerName;
	this.gameInProgress = true;
  }
  
  endGame() {
	this.noNameProvided = true;
	this.playerNames.humanPlayer = '';
	this.gameInProgress = false;
  }
  
  showRules() {
	this.rulesHidden = false;
  }
  
  hideRules() {
	this.rulesHidden = true;
  }
  
}
