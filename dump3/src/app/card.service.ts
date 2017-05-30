import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CardService {

	constructor(private http: Http) { }

	// Shuffle a new deck from http://deckofcardsapi.com/
	newDeck(room) {
	console.log('test', room);
	return this.http.post('/api/newdeck', room).map(r => {
	console.log(r);r.json();});
	}
}
