import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingsRoutingModule } from './coachings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoachingsComponent } from './coachings.component';

@NgModule({
  declarations: [
    CoachingsComponent,
  ],
  imports: [
    CommonModule,
    CoachingsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoachingsModule { }
