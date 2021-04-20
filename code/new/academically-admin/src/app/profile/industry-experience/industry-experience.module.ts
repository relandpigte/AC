import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryExperienceRoutingModule } from './industry-experience-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { IndustryExperienceComponent } from './industry-experience.component';

@NgModule({
  declarations: [
    IndustryExperienceComponent,
  ],
  imports: [
    CommonModule,
    IndustryExperienceRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class IndustryExperienceModule { }
