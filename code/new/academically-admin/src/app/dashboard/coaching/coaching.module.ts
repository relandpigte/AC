import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingRoutingModule } from './coaching-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoachingComponent } from './coaching.component';

@NgModule({
  declarations: [
    CoachingComponent,
  ],
  imports: [
    CommonModule,
    CoachingRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoachingModule { }
