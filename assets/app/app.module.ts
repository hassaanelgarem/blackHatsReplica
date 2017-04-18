import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";


import { AppComponent } from "./app.component";
import { HomepageComponent} from "./homepage/homepage.component";
import { NavComponent} from "./navigationBar/nav.component";
import { LoginComponent} from "./user/login/login.component";
import { RegisterComponent} from "./user/register/register.component";
import { SearchComponent} from "./homepage/search/search.component";
import { NameOrTagComponent} from "./homepage/search/nameOrTagResult//result.component";
import { TopBusinessesComponent } from "./homepage/topBusinesses/topBusinesses.component";
import { AdSlotsComponent } from "./homepage/adSlots/adSlots.component"




import { HomepageService } from "./homepage/homepage.service";
import { AppService } from "./app.service";
import { SearchService } from "./homepage/search/search.service";
import { AdSlotsService } from "./homepage/adSlots/adSlots.service";
import { TopBusinessesService } from "./homepage/topBusinesses/topBusinesses.service";




@NgModule({
    declarations : [
      AppComponent,
      HomepageComponent,
      NavComponent,
      LoginComponent,
      RegisterComponent,
      SearchComponent,
      NameOrTagComponent,
      TopBusinessesComponent,
      AdSlotsComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [HomepageService,AppService,SearchService,AdSlotsService,TopBusinessesService],
    bootstrap : [AppComponent]
})

export class AppModule{

}
