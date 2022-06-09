import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceRoutingModule } from './experience-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ExperienceComponent } from './experience.component';
import { AddExperienceComponent } from './_components/add-experience/add-experience.component';

@NgModule({
  declarations: [
    ExperienceComponent,
    AddExperienceComponent
  ],
  imports: [
    CommonModule,
    ExperienceRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class ExperienceModule { }
