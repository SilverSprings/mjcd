import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {

	constructor(private roomService:RoomService){}	
	socket:any;
	socket = io();

	joinRoom(player) {
		this.socket.emit('joinroom', player);
	}
	
	playerComeIn() {
		let obs = new Observable(observer => {
			this.socket.on('playercomein', (player) => observer.next(player));
		});
		return obs;
	}
	
	leaveRoom(player) {
	
	}
	
	iAmReadytoSD(player) {
		this.socket.emit('playerReadytoSD', handFinal);
	}	

}