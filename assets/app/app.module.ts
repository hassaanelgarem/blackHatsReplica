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
import { BusinessActivitiesComponent} from "./businessEdit/activities/businessActivities.component"
import { EditActivityComponent} from "./businessEdit/activities/editActivity.component"

import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./businessEdit/business.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessEditComponent,
      BusinessReviewsComponent,
      BusinessActivitiesComponent,
      EditActivityComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      MomentModule
    ],
    providers: [DummyService, BusinessService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
