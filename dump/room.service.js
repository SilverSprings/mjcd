import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RoomService {
	private headers = new Headers({'Content-Type': 'application/json'});
	constructor(private http: Http) { }

	// Get a player in a room for a game
	allRooms() {
	return this.http.get('/api/allrooms').map(r => r.json());
	}
	addPlayerInRoom(pInR) {
	return this.http.post('/api/addplayerinroom',pInR).map(r => r.json());
	}
	
	this.socket.emit('playerReady', {roomId:this.roomId, playerName:playerName});
}