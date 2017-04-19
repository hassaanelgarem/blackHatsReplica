import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';

import { ReviewComponent } from './review.component';
import { UnAssignAdminComponent } from './unAssignAdmin.component';
import { AssignAdminComponent } from './assignAdmin.component';

@NgModule({
    declarations: [
        AssignAdminComponent,
        ReviewComponent,
        UnAssignAdminComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [UserService]
})

export class UserModule {

};
