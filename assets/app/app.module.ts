import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { BusinessPageComponent } from "./businessPage/businessPage.component";

import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./business/business.service";
import { BusinessPageService } from "./businessPage/businessPage.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessComponent,
      BusinessPageComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService, BusinessService, BusinessPageService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
