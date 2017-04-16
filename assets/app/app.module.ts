import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { EditProfileComponent } from "./editProfile/editProfile.component";
import { AddPhotoComponent } from "./addPhoto/addPhoto.component";

import { DummyService } from "./dummy/dummy.service";
import { EditProfileService } from "./editProfile/editProfile.service";
import { AddPhotoService } from "./addPhoto/addPhoto.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      EditProfileComponent,
      AddPhotoComponent,
      FileSelectDirective
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService, EditProfileService, AddPhotoService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
