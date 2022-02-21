import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleEventRoutingModule } from './single-event-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SingleEventComponent } from './single-event.component';

@NgModule({
  declarations: [
    SingleEventComponent,
  ],
  imports: [
    CommonModule,
    SingleEventRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class SingleEventModule { }
