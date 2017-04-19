import { SharedModule } from '../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { VerifyComponent } from './verify.component';

import { BusinessService } from './business.service';


@NgModule({
  declarations: [
    ReviewComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [BusinessService]
})

export class BusinessModule {

};
