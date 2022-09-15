import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CoachingRoutingModule } from './coaching-routing.module';

import { ExploreCoachingComponent } from './coaching.component';

@NgModule({
  declarations: [
    ExploreCoachingComponent,
  ],
  imports: [
    CommonModule,
    CoachingRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreCoachingModule { }
