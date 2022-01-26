import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DetailsRoutingModule} from './details-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { DetailsComponent } from './details.component';

@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class DetailsModule { }
