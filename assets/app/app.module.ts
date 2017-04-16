import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import {MomentModule} from 'angular2-moment';


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { BusinessReviewsComponent} from "./businessEdit/reviews/businessReviews.component"
import { UserComponent } from "./user/user.component"
import { UserBookingsComponent } from "./user/Bookings/userBookings.component"

import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./businessEdit/business.service";
import { UserService } from "./user/user.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessEditComponent,
      BusinessReviewsComponent,
      UserComponent,
      UserBookingsComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      MomentModule
    ],
    providers: [DummyService, BusinessService, UserService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
