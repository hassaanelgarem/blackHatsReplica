import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';

import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    BusinessModule
  ]
})

export class AdminModule {
  
};
