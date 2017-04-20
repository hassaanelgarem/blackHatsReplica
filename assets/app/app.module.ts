import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
//import {MomentModule} from 'angular2-moment';

import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";

import { UserComponent } from "./user/user.component";
import { HeaderComponent }from "./user/header.component";
import { ReviewComponent } from "./user/reviews/review.component";
import { UserFavoritesComponent } from "./user/favorites/favorites.component";
import { UserBookingsComponent } from "./user/bookings/userBookings.component";
import { EditProfileComponent } from "./user/editProfile/editProfile.component";
import { FourofourComponent } from "./errors/404.component";
import { NotAuthorizedErrorComponent } from "./errors/notAuthorized.component";
import { SomethingWrongComponent } from "./errors/500.component";


import { DummyService } from "./dummy/dummy.service";
//import { BusinessService } from "./business/business.service";
import { UserService } from "./user/user.service";
import { EditProfileService } from "./user/editProfile/editProfile.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      FourofourComponent,
      UserComponent,
      HeaderComponent,
      ReviewComponent,
      UserFavoritesComponent,
      UserBookingsComponent,
      EditProfileComponent,
      FileSelectDirective,
      NotAuthorizedErrorComponent,
      SomethingWrongComponent
      
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService,UserService,EditProfileService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
