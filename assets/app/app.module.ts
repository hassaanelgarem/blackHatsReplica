import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";

import { SwiperModule } from 'angular2-useful-swiper';

import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { BusinessPageComponent } from "./businessPage/businessPage.component";
import { ReviewsComponent } from "./reviews/reviews.component";

import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./business/business.service";
import { BusinessPageService } from "./businessPage/businessPage.service";
import { ReviewsService } from "./reviews/reviews.service";

@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessComponent,
      BusinessPageComponent,
      ReviewsComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      SwiperModule
    ],
    providers: [DummyService, BusinessService, BusinessPageService, ReviewsService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
