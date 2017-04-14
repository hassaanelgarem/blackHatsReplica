import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";

import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./businessEdit/business.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessEditComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService, BusinessService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
