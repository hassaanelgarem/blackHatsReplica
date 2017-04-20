import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { MomentModule } from 'angular2-moment';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';


import { AppComponent } from "./app.component";
import { EditProfileComponent } from "./businessEdit/editProfile/editProfile.component";
import { AddPhotoComponent } from "./businessEdit/addPhoto/addPhoto.component";
import { BookAdvComponent } from "./businessEdit/bookAdv/bookAdv.component";
import { ActivityBookingsComponent } from "./businessEdit/activityBookings/activityBookings.component";

import { EditProfileService } from "./businessEdit/editProfile/editProfile.service";
import { AddPhotoService } from "./businessEdit/addPhoto/addPhoto.service";
import { BookAdvService } from "./businessEdit/bookAdv/bookAdv.service";
import { ActivityBookingsService } from "./businessEdit/activityBookings/activityBookings.service";

@NgModule({
    declarations : [
      AppComponent,
      EditProfileComponent,
      AddPhotoComponent,
      BookAdvComponent,
      ActivityBookingsComponent,
      FileSelectDirective
    ],
    imports: [
      BrowserModule,
      MomentModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [EditProfileService, AddPhotoService, BookAdvService, ActivityBookingsService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
