import { LoaderComponent } from './loader.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AdminModule } from './admin/admin.module';

import { routing } from "./app.routing";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AdminModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

};
