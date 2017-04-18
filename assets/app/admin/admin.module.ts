import { UserService } from './user/user.service';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { UserModule } from './user/user.module';

import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule
  ],
  providers: [UserService]
})

export class AdminModule {
  
};
