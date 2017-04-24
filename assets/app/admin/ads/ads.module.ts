import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { AdsService } from './ads.service';

import { AdsComponent } from './ads.component';

@NgModule({
    declarations: [
        AdsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    providers: [AdsService]
})

export class AdsModule {

};
