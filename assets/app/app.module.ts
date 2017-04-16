import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
//import {MomentModule} from 'angular2-moment';

import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";

import { UserComponent } from "./user/user.component";
import { HeaderComponent }from "./user/header.component";
import { ReviewComponent } from "./user/reviews/review.component";
import { FavoritesComponent } from "./user/favorites/favorites.component";


import { DummyService } from "./dummy/dummy.service";
//import { BusinessService } from "./business/business.service";
import { UserService } from "./user/user.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      UserComponent,
      HeaderComponent,
      ReviewComponent,
      FavoritesComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService,UserService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
