import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BotroomComponent } from './botroom/botroom.component';

// Services
import { RoomService } from './room.service';
import { CardService } from './card.service';

// Define the routes
const ROUTES = [
/*  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: MenuComponent
  } */
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BotroomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [RoomService, CardService],
  bootstrap: [MenuComponent]
})
export class AppModule { }
