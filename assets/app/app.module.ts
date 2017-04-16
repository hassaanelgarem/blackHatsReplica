import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { HomepageComponent} from "./homepage/homepage.component";
import { NavComponent} from "./navigationBar/nav.component";
import { LoginComponent} from "./user/login/login.component";
import { RegisterComponent} from "./user/register/register.component";


import { DummyService } from "./dummy/dummy.service";
import { BusinessService } from "./business/business.service";
import { HomepageService } from "./homepage/homepage.service";
import { RegisterService } from "./user/register/register.service";


@NgModule({
    declarations : [
      AppComponent,
      DummyComponent,
      BusinessComponent,
      HomepageComponent,
      NavComponent,
      LoginComponent,
      RegisterComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [DummyService, BusinessService, HomepageService, RegisterService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
