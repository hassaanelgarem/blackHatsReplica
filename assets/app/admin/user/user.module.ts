import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';

import { ReviewComponent } from './review.component';

@NgModule({
    declarations: [
        ReviewComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})

export class UserModule {

};
