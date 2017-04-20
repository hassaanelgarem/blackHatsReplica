import { AdminService } from './admin.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';
import { SupportModule } from './support/support.module';
import { AdsModule } from './ads/ads.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    BusinessModule,
    SupportModule,
    AdsModule
  ],
  providers: [AdminService]
})

export class AdminModule {

};
