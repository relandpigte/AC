import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopsRoutingModule } from './workshops-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { WorkshopsComponent } from './workshops.component';

@NgModule({
  declarations: [
    WorkshopsComponent,
  ],
  imports: [
    CommonModule,
    WorkshopsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class WorkshopsModule { }
