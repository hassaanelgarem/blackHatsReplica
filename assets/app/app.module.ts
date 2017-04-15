import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { UserComponent } from "./user/user.component";
import { UserHeaderComponent } from "./user/header.component"; 
import { ReviewsComponent } from "./user/reviews/reviews.component";
import { ReviewListComponent } from "./user/reviews/review-list.component";
import { ReviewComponent } from "./user/reviews/review.component"; 
import { ReviewService } from "./user//reviews/review.service";
import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./business/business.service";
import { UserService } from "./user/user.service";

@NgModule({
    declarations : [
      AppComponent,
      UserHeaderComponent,
      DummyComponent,
      BusinessComponent,
      UserComponent,
      ReviewsComponent,
      ReviewListComponent,
      ReviewComponent,
      ReviewService,
      DummyService,
      BusinessService,
      UserService

    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService, BusinessService,UserService,ReviewService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
