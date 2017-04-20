import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { MomentModule } from 'angular2-moment';
import { DateTimePickerModule } from 'ng2-date-time-picker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FocusDirective } from './directives/focus.directive';
import { RatingModule } from "ngx-rating";


import { AppComponent } from "./app.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { BusinessReviewsComponent} from "./businessEdit/reviews/businessReviews.component"
import { BusinessActivitiesComponent} from "./businessEdit/activities/businessActivities.component"
import { EditActivityComponent} from "./businessEdit/activities/editActivity.component"

import { BusinessService } from "./businessEdit/business.service";

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  acceptedFiles: 'image/*'
};

@NgModule({
    declarations : [
      AppComponent,
      BusinessEditComponent,
      BusinessReviewsComponent,
      BusinessActivitiesComponent,
      EditActivityComponent,
      FocusDirective
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      MomentModule,
      DateTimePickerModule,
      DropzoneModule.forRoot(DROPZONE_CONFIG),
      RatingModule

    ],
    providers: [BusinessService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
