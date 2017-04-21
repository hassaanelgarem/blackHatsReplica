import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { BusinessComponent } from "./businessTemp/business.component";
import { HomepageComponent} from "./homepage/homepage.component";
import { NavComponent} from "./navigationBar/nav.component";
import { LoginComponent} from "./user/login/login.component";
import { RegisterComponent} from "./user/register/register.component";


import { BusinessService } from "./businessTemp/business.service";
import { HomepageService } from "./homepage/homepage.service";



@NgModule({
    declarations : [
      AppComponent,
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
    providers: [
      BusinessService,
      HomepageService
    ],
    bootstrap : [AppComponent]
})

export class AppModule{

}
