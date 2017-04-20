import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { MomentModule } from 'angular2-moment';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
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
import { EditProfileComponent } from "./businessEdit/editProfile/editProfile.component";
import { AddPhotoComponent } from "./businessEdit/addPhoto/addPhoto.component";
import { BookAdvComponent } from "./businessEdit/bookAdv/bookAdv.component";
import { ActivityBookingsComponent } from "./businessEdit/activityBookings/activityBookings.component";


import { BusinessService } from "./businessEdit/business.service";
import { EditProfileService } from "./businessEdit/editProfile/editProfile.service";
import { AddPhotoService } from "./businessEdit/addPhoto/addPhoto.service";
import { BookAdvService } from "./businessEdit/bookAdv/bookAdv.service";
import { ActivityBookingsService } from "./businessEdit/activityBookings/activityBookings.service";


const DROPZONE_CONFIG: DropzoneConfigInterface = {
  acceptedFiles: 'image/*'
};


@NgModule({
    declarations : [
      ActivityBookingsComponent,
      AddPhotoComponent,
      AppComponent,
      BookAdvComponent,
      BusinessActivitiesComponent,
      BusinessEditComponent,
      BusinessReviewsComponent,
      EditActivityComponent,
      EditProfileComponent,
      FileSelectDirective,
      FocusDirective
    ],
    imports: [
      BrowserModule,
      MomentModule,
      FormsModule,
      HttpModule,
      routing,
      MomentModule,
      DateTimePickerModule,
      DropzoneModule.forRoot(DROPZONE_CONFIG),
      RatingModule

    ],
    providers: [BusinessService, EditProfileService, AddPhotoService, BookAdvService, ActivityBookingsService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
